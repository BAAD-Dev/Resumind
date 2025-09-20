import { prisma } from "../../db/prisma.js";
import GeminiService from "../../services/gemini.js";
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

const JOB_MATCH_ANALYSIS_PROMPT = `
You are an expert career strategist and senior technical recruiter. Your task is to perform a detailed comparative analysis of the provided CV against the provided Job Description.

Your response MUST be a valid JSON object. Do not include any text, markdown, or explanations outside of the JSON structure. All string values in the final JSON object must be in professional English.

The JSON object must have the following structure:

{
  "matchScore": <an integer between 0 and 100 representing how well the CV matches the job requirements>,
  "matchSummary": "<a 2-3 sentence summary explaining the overall fit and highlighting the candidate's strongest qualifications for this specific role>",

  "keywordAnalysis": {
    "jobKeywords": [<an array of the top 10 most important keywords found in the Job Description>],
    "matchedKeywords": [<an array of keywords that are present in BOTH the Job Description and the CV>],
    "missingKeywords": [<an array of important keywords from the Job Description that are MISSING from the CV>]
  },

  "strengths": [
    "<An array of strings, where each string is a bullet point explaining a specific strength or experience from the CV that directly aligns with a requirement in the Job Description>"
  ],

  "improvementAreas": [
    "<An array of strings, where each string is a bullet point identifying a gap or a skill mentioned in the Job Description that is weak or absent in the CV>"
  ],
  
  "suggestedEdits": [
    {
      "originalCVBullet": "<Copy one of the candidate's weaker experience bullet points from their CV>",
      "suggestedRewrite": "<Rewrite that bullet point to better align with the language and requirements of the Job Description, making it more impactful for this specific application.>"
    }
  ]
}
`;

class AnalysisService {
  async analyzeCvForUser(cvId: string, userId: string) {
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

    const response = await axios.get(cv.fileUrl, {
      responseType: "arraybuffer",
    });
    const fileBuffer = Buffer.from(response.data);

    const analysisJson = await GeminiService.analyzeFile(
      fileBuffer,
      "application/pdf",
      CV_ANALYSIS_PROMPT
    );

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
    const analysisJson = await GeminiService.analyzeFile(
      file.buffer,
      file.mimetype,
      GUEST_CV_ANALYSIS_PROMPT
    );

    return analysisJson;
  }

  async analyzeJobMatch(cvId: string, jobId: string, userId: string) {
    // 1. THE PAYWALL: Check if the user is a PAID member
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "PAID") {
      throw new Error(
        "Access denied. This is a premium feature for PAID users.",
        {
          cause: { status: 402 }, // 402 Payment Required
        }
      );
    }

    // 2. Fetch the CV and Job Description, ensuring they belong to the user
    const cv = await prisma.cV.findUnique({
      where: { id: cvId, userId: userId },
    });
    const job = await prisma.jobDescription.findUnique({
      where: { id: jobId, userId: userId },
    });

    if (!cv || !job) {
      throw new Error("CV or Job Description not found or access denied.", {
        cause: { status: 404 },
      });
    }

    // 3. Download the CV file content
    const response = await axios.get(cv.fileUrl, {
      responseType: "arraybuffer",
    });
    const cvBuffer = Buffer.from(response.data);

    // 4. Create a special prompt for Gemini that includes the job description text
    const promptForGemini = `
      Here is the Job Description text:
      ---
      ${job.originalText}
      ---

      Now, perform a detailed comparative analysis of the following CV against that Job Description, using these instructions:
      ${JOB_MATCH_ANALYSIS_PROMPT}
    `;

    // 5. Call our AI "engine" with the CV file and our special combined prompt
    const analysisJson = await GeminiService.analyzeFile(
      cvBuffer,
      "application/pdf",
      promptForGemini
    );

    // 6. Save the result as a new type of analysis
    const newAnalysis = await prisma.analysis.create({
      data: {
        type: "JOB_MATCH_ANALYSIS",
        status: "COMPLETED",
        result: analysisJson as any,
        userId: userId,
        cvId: cvId,
        jobDescriptionId: jobId,
      },
    });

    return newAnalysis;
  }

  async getAnalysesForCV(cvId: string, userId: string) {
    // This query is extra secure. It finds all analyses that match
    // BOTH the cvId and the userId, preventing users from seeing other people's reports.
    const analyses = await prisma.analysis.findMany({
      where: {
        cvId: cvId,
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return analyses;
  }

  
}

export default new AnalysisService();
