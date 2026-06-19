"use server"

import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface LLMScores {
  clickbait: {
    score: number;
    label: string;
  };
  emotion: {
    label: string;
    intensity: number;
  };
  bias: {
    label: string;
    confidence: number;
  };
}

export async function gradeHeadline(headline: string): Promise<LLMScores> {
  const prompt = `Analyze the following headline:

"${headline}"

Use this rubric:

CLICKBAIT:
0.0–0.3 = factual, descriptive, specific
0.4–0.6 = mildly attention-seeking or vague
0.7–1.0 = highly sensational, curiosity-driven, or vague with withheld info

EMOTIONAL_TONE:
Label: ["neutral", "mild_positive", "mild_negative", "strong_positive", "strong_negative"]
Score: 0.0–1.0 intensity
Rules:
- neutral = factual reporting language
- strong = emotionally loaded words or urgency

FRAMING_BIAS:
Label: ["neutral", "lean_positive", "lean_negative", "unclear"]
Rules:
- Only judge linguistic framing, not truth
- Positive/negative = tone toward entities or actions
- If no clear entity framing exists → "neutral"`;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      clickbait: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          label: { type: Type.STRING } 
        },
        required: ['score', 'label']
      },
      emotion: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          intensity: { type: Type.NUMBER }
        },
        required: ['label', 'intensity']
      },
      bias: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ['label', 'confidence']
      }
    },
    required: ['clickbait', 'emotion', 'bias'],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error('No text returned from Gemini');
    
    return JSON.parse(text) as LLMScores;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI grading temporarily unavailable. Please try again.");
  }
}
