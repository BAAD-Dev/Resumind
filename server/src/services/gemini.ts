// src/services/gemini.service.ts
import { GoogleGenAI, type Part } from "@google/genai";
import { env } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

const MODEL = "gemini-2.5-flash" as const;

class GeminiService {
  async analyzeFile(
    fileBuffer: Buffer,
    mimeType: string,
    prompt: string
  ): Promise<unknown> {
    const parts: Part[] = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: fileBuffer.toString("base64"),
        },
      },
    ];

    try {
      const res = await ai.models.generateContent({
        model: MODEL,
        contents: parts,
        config: {
          responseMimeType: "application/json",
          temperature: 1,
        },
      });

      const text = res.text;
      if (!text)
        throw new Error("Gemini no response", { cause: { status: 400 } });
      return JSON.parse(text);
    } catch (err) {
      console.log(">>>>>>>>>>ERROR: ", err);
      console.error("Error analyzing file with Gemini:", err);
      throw new Error("Failed to get analysis from Gemini.");
    }
  }
}

export default new GeminiService();
