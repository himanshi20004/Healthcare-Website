import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(); // Uses GOOGLE_APPLICATION_CREDENTIALS

export async function POST(req) {
  try {
    const { doubt } = await req.json();
    if (!doubt || !doubt.trim()) {
      return NextResponse.json({ error: "Doubt cannot be empty." }, { status: 400 });
    }

    const prompt = `
You are a calm, highly knowledgeable medical assistant.
Your job is to help users understand symptoms, medicines, diseases and health concerns.
Rules:
• Explain in simple, clear language.
• Provide safe guidance & precautions.
• Only general info, NOT medical prescriptions.
• If serious, tell them to see a doctor.

User Question:
"${doubt}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.1-large", // use a valid model from ListModels
      contents: prompt,
    });

    return NextResponse.json({ answer: response.text || "Sorry, no answer generated." });
  } catch (err) {
    console.error("AI API error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
