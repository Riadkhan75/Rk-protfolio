import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function chatWithAI(message: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: `You are an AI terminal interface representing a developer. 
        Context about the developer: ${context}
        Your tone: Technical, mysterious, hacker-like, but helpful. 
        Keep responses concise (max 3 sentences). 
        Always speak in the first person as if you ARE the system.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "ERROR: CONNECTION_TIMEOUT. AI_OFFLINE.";
  }
}

export async function generateBlogDraft(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Write a technical blog post outline or draft about: ${topic}. 
      Format: Markdown. Include code snippets if relevant. Tone: Professional and expert.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Blog Assistant Error:", error);
    return "FAILED TO GENERATE CONTENT.";
  }
}
