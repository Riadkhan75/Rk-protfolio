import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const ai = getGeminiClient();

export async function chatWithAI(message: string, context: string) {
  if (!ai) return "ERROR: AI_MODULE_NOT_CONFIGURED. CHECK_API_KEY.";
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
  if (!ai) return "AI_OFFLINE: API_KEY_MISSING";
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
