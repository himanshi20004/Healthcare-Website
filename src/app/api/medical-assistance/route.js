import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { doubt } = await req.json();

    if (!doubt || doubt.trim() === "") {
      return NextResponse.json({ error: "Doubt cannot be empty." }, { status: 400 });
    }

    const prompt = `
You are a calm, highly knowledgeable medical assistant.
Your job is to help users understand symptoms, medicines, diseases and health concerns.
Rules:

• Explain everything in simple, clear language.
• Provide safe medical guidance & precautions.
• Give general info only, NOT medical prescriptions.
• If it's serious, tell them to see a doctor.

User Question:
"${doubt}"

Give a detailed, easy-to-understand explanation in clean paragraphs.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response.text()) || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
