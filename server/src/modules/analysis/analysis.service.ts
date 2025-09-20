import { prisma } from "../../db/prisma.js";
import GeminiService from "../../services/gemini.js"; // This is YOUR proven AI service
import axios from "axios";

const CV_ANALYSIS_PROMPT = `
You are an elite career coach and a senior technical recruiter with deep expertise in Applicant Tracking Systems (ATS). Your task is to perform a deep, comprehensive analysis of the provided CV and return a structured report.

Your response MUST be a valid JSON object. Do not include any text, markdown, or explanations outside of the JSON structure.

The JSON object must have the following structure:

{
  "overallScore": <an integer between 0 and 100 representing the overall quality and ATS readiness of the CV>,
  "summary": "<a 2-3 sentence professional summary of the candidate, highlighting their key strengths and experience level>",
  
  "extractedKeywords": {
    "technicalSkills": [<an array of technical skills like 'JavaScript', 'Node.js', 'AWS'>],
    "softSkills": [<an array of soft skills like 'Teamwork', 'Communication', 'Problem-Solving'>]
  },

  "sectionBreakdown": [
    {
      "sectionName": "Contact Info & Formatting",
      "score": <an integer between 0 and 100 for this section>,
      "positiveFeedback": "<a string explaining what was done well in this section>",
      "improvementSuggestions": "<a string with specific, actionable advice for this section>"
    },
    {
      "sectionName": "Summary / Objective",
      "score": <an integer between 0 and 100 for this section>,
      "positiveFeedback": "<a string explaining what was done well>",
      "improvementSuggestions": "<a string with specific, actionable advice>"
    },
    {
      "sectionName": "Experience",
      "score": <an integer between 0 and 100 for this section>,
      "positiveFeedback": "<a string explaining what was done well, e.g., use of action verbs>",
      "improvementSuggestions": "<a string with specific, actionable advice, e.g., 'Quantify achievements with metrics like percentages or dollar amounts to show impact.'>"
    },
    {
      "sectionName": "Projects",
      "score": <an integer between 0 and 100 for this section>,
      "positiveFeedback": "<a string explaining what was done well>",
      "improvementSuggestions": "<a string with specific, actionable advice>"
    },
    {
      "sectionName": "Skills",
      "score": <an integer between 0 and 100 for this section>,
      "positiveFeedback": "<a string praising the relevance and organization of listed skills>",
      "improvementSuggestions": "<a string suggesting missing keywords common for the target role>"
    }
  ],
  
  "rewrittenContent": {
    "improvedSummary": "<Rewrite the candidate's summary to be more impactful and professional, incorporating keywords naturally.>",
    "improvedExperienceBullets": [
      "<Take one of the candidate's weaker experience bullet points and rewrite it to be more results-oriented, using the STAR (Situation, Task, Action, Result) method.>",
      "<Take another bullet point and rewrite it to include quantifiable metrics.>"
    ]
  },

  "actionableNextSteps": [
    "<a string with the single most important thing the candidate should fix>",
    "<a string with the second most important improvement>",
    "<a string with a final suggestion for polishing the CV>"
  ]
}
`;

const GUEST_CV_ANALYSIS_PROMPT = `
You are an expert ATS (Applicant Tracking System) analyzer.
Analyze the provided CV document and return ONLY the overall score and a brief summary.
Your response MUST be a valid JSON object. Do not include any text, markdown, or explanations outside of the JSON structure.
The JSON object must have the following structure:
{
  "overallScore": <an integer between 0 and 100 representing the overall quality and ATS readiness of the CV>,
  "summary": "<a 2-3 sentence professional summary of the candidate, highlighting their key strengths and experience level>"
}
`;

class AnalysisService {
  async analyzeCvForUser(cvId: string, userId: string) {
    // Step A: Find the CV in our database, ensuring it belongs to the logged-in user.
    const cv = await prisma.cV.findUnique({
      where: { id: cvId, userId: userId },
    });

    if (!cv) {
      throw new Error(
        "CV not found or you do not have permission to access it.",
        {
          cause: { status: 404 },
        }
      );
    }

    // Step B: Download the file from the Cloudinary URL into a buffer.
    const response = await axios.get(cv.fileUrl, {
      responseType: "arraybuffer",
    });
    const fileBuffer = Buffer.from(response.data);

    // Step C: Call your proven GeminiService with the file and our specific prompt.
    const analysisJson = await GeminiService.analyzeFile(
      fileBuffer,
      "application/pdf", // We'll assume PDF for now
      CV_ANALYSIS_PROMPT
    );

    // Step D: Save the structured result from Gemini into our Analysis collection.
    const newAnalysis = await prisma.analysis.create({
      data: {
        type: "CV_ANALYSIS",
        status: "COMPLETED",
        result: analysisJson as any, // Cast to 'any' to match the flexible JSON type
        userId: userId,
        cvId: cvId,
      },
    });

    return newAnalysis;
  }

  async analyzeCvForGuest(file: Express.Multer.File) {
    // This function takes the file buffer directly, analyzes it, and returns the result.
    // It does NOT interact with the database.
    const analysisJson = await GeminiService.analyzeFile(
      file.buffer,
      file.mimetype,
      GUEST_CV_ANALYSIS_PROMPT
    );

    return analysisJson;
  }
}

export default new AnalysisService();
