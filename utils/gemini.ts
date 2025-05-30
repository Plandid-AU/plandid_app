import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
// Note: In production, store the API key securely in environment variables
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const genAI =
  API_KEY !== "YOUR_GEMINI_API_KEY" ? new GoogleGenerativeAI(API_KEY) : null;

export interface MessageContext {
  vendorName: string;
  vendorType: string;
  userName: string;
  partnerName?: string;
  weddingDate?: Date;
  weddingLocation?: string;
}

export const generateVendorMessage = async (
  context: MessageContext
): Promise<string> => {
  // If no valid API key is configured, use fallback immediately
  if (!genAI || API_KEY === "YOUR_GEMINI_API_KEY") {
    console.log("Gemini API key not configured, using fallback message");
    return generateFallbackMessage(context);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a helpful assistant that writes personalized messages for couples to send to wedding vendors. 
Write a warm, professional, and engaging message based on the following context:

Vendor Name: ${context.vendorName}
Vendor Type: ${context.vendorType}
Couple Names: ${context.userName}${
      context.partnerName ? ` and ${context.partnerName}` : ""
    }
Wedding Date: ${
      context.weddingDate
        ? context.weddingDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Not specified"
    }
Wedding Location: ${context.weddingLocation || "Not specified"}

Guidelines:
- Keep the message between 50-150 words
- Be warm and personal but professional
- Express genuine interest in their work
- Mention specific details about the wedding when available
- Ask about availability and services
- End with enthusiasm about potentially working together
- Don't use overly formal language
- Make it sound natural and conversational

Write only the message content, no additional formatting or explanations.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating message with Gemini:", error);
    return generateFallbackMessage(context);
  }
};

const generateFallbackMessage = (context: MessageContext): string => {
  const fallbackMessage = `Hi ${context.vendorName}! We're ${context.userName}${
    context.partnerName ? ` and ${context.partnerName}` : ""
  }, and we're planning our wedding${
    context.weddingDate
      ? ` for ${context.weddingDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`
      : ""
  }${
    context.weddingLocation ? ` in ${context.weddingLocation}` : ""
  }. We've been admiring your ${context.vendorType.toLowerCase()} work and would love to know more about your services and availability. Looking forward to hearing from you!`;

  return fallbackMessage;
};
