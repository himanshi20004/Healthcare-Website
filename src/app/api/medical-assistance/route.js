import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    // 1. Check for API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is missing in environment variables." },
        { status: 500 }
      );
    }

    // 2. Parse User Input
    const { doubt } = await req.json();
    if (!doubt || !doubt.trim()) {
      return NextResponse.json(
        { error: "Doubt cannot be empty." },
        { status: 400 }
      );
    }

    // 3. Initialize Client
    // Explicitly passing apiKey prevents the "project undefined" error
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 4. Construct Prompt
    const promptText = `
    You are a calm, highly knowledgeable medical assistant.
    Your job is to help users understand symptoms, medicines, diseases and health concerns.
    
    Rules:
    • Explain in simple, clear language.
    • Provide safe guidance & precautions.
    • Only general info, NOT medical prescriptions.
    • If serious, tell them to see a doctor immediately.
    
    User Question: "${doubt}"
    `;

    // 5. Generate Content
    // Using gemini-1.5-flash as it is the current standard production model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ],
    });

    // 6. Extract Text (THE FIX)
    // We access the raw JSON structure directly to avoid "response.text is not a function"
    const answerText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ answer: answerText });

  } catch (err) {
    console.error("AI API error:", err);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}