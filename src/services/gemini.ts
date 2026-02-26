import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MapPlace {
  title: string;
  uri: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  places?: MapPlace[];
}

export async function chatWithMaps(
  message: string,
  history: ChatMessage[],
  location?: { latitude: number; longitude: number }
) {
  try {
    const model = "gemini-2.5-flash"; // Required for googleMaps tool
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: location ? {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          } : undefined
        }
      },
    });

    const text = response.text || "I couldn't find an answer for that.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const places: MapPlace[] = groundingChunks
      .filter(chunk => chunk.maps)
      .map(chunk => ({
        title: chunk.maps!.title || "Location",
        uri: chunk.maps!.uri || "",
      }));

    return { text, places };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "Sorry, I encountered an error while searching for locations. Please try again.", 
      places: [] 
    };
  }
}
