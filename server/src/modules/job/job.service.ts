import { prisma } from "../../db/prisma.js";
import GeminiService from "../../services/gemini.js";
import type { CreateJobFromTextInput } from "./job.types.js";

const JOB_PARSING_PROMPT = `
You are an expert data extraction and translation system for job postings. Your task is to analyze the following raw text from a job posting and extract the key information into a structured JSON format.

Your response MUST be a valid JSON object. Do not include any text, markdown, or explanations outside of the JSON structure.

***IMPORTANT RULE: All string values in the final JSON object must be in English. If the source text for a field is in another language, you must translate it to professional English before including it in the response.***

The JSON object must have the following structure:

{
  "title": "<The job title>",
  "company": "<The company name>",
  "location": "<The primary location of the job>",
  "employmentType": "<The type of employment>",
  "experienceLevel": "<The required years of experience>",
  "summary": "<A one-sentence summary of the job's core purpose>",
  "keySkills": [
    "<An array of strings listing the most important technical skills and tools>"
  ],
  "responsibilities": [
    "<An array of strings, where each string is a bullet point from the 'Responsibilities' section>"
  ],
  "requirements": [
    "<An array of strings, where each string is a bullet point from the 'Requirements' or 'Qualifications' section>"
  ]
}
`;

// Defines the shape of the JSON we expect back from Gemini
interface ParsedJobData {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  summary: string;
  keySkills: string[];
  responsibilities: string[];
  requirements: string[];
}

class JobService {
  async createJobFromText(data: CreateJobFromTextInput, userId: string) {
    const { jobText } = data;

    // 1. Call Gemini to parse the raw text into our detailed structure
    const parsedData = (await GeminiService.analyzeFile(
      Buffer.from(jobText),
      "text/plain",
      JOB_PARSING_PROMPT
    )) as ParsedJobData;

    // 2. Save all the new, structured data to our updated database schema
    const newJob = await prisma.jobDescription.create({
      data: {
        title: parsedData.title || "Untitled Job",
        company: parsedData.company || "Unknown Company",
        location: parsedData.location,
        employmentType: parsedData.employmentType,
        experienceLevel: parsedData.experienceLevel,
        summary: parsedData.summary,
        keySkills: parsedData.keySkills,
        responsibilities: parsedData.responsibilities,
        requirements: parsedData.requirements,
        originalText: jobText,
        userId: userId,
      },
    });

    return newJob;
  }

  async getJobsForUser(userId: string) {
    const jobs = await prisma.jobDescription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return jobs;
  }

  async deleteJobForUser(jobId: string, userId: string) {
    // Prisma's delete operation is smart. It will automatically fail if
    // a job with this ID and userId is not found, providing security.
    await prisma.jobDescription.delete({
      where: { id: jobId, userId: userId },
    });

    return {
      message:
        "Job Description and all associated analyses deleted successfully.",
    };
  }
}

export default new JobService();
