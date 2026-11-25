import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API key not found. Check your .env.local file.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
    });

    return Response.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}