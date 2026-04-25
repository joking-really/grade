import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  async gradeBatch(questionPaper: string, rubric: any, submissions: string[]) {
    const prompt = `
      You are an expert academic grader. 
      Question Paper: ${questionPaper}
      Rubric: ${JSON.stringify(rubric)}
      
      Grade the following student submissions. For each submission, return:
      1. Scores per question (e.g., Q1: 5/5, Q2: 3/5)
      2. Constructive feedback.
      3. Total score.
      
      Format the output as a JSON array of objects: 
      [{ "studentIndex": number, "scores": { "Q1": { "obtained": number, "max": number }, ... }, "totalScore": number, "maxScore": number, "feedback": string }]

      Submissions:
      ${submissions.map((s, i) => `[Student ${i}] ${s}`).join('\n')}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || '';
      return JSON.parse(text);
    } catch (e) {
      console.error("AI Grading Error:", e);
      throw e;
    }
  }
};
