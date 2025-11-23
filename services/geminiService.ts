import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult, PredictionInput } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const predictHomaWithGemini = async (
  input: PredictionInput
): Promise<PredictionResult> => {
  try {
    const prompt = `
      Actúa como una Red Neuronal Artificial médica experta (modelo .h5) entrenada para predecir la Resistencia a la Insulina (HOMA-IR).
      
      Tus inputs son:
      - Sexo: ${input.sex}
      - Glucosa en ayunas: ${input.glucose} mg/dL
      - Índice de Masa Corporal (IMC): ${input.bmi} kg/m²
      
      Contexto médico: El HOMA-IR (Homeostatic Model Assessment) generalmente requiere insulina, pero este modelo específico ha sido entrenado para estimarlo basándose en correlaciones metabólicas con el IMC y la Glucosa.
      
      Tarea:
      1. Calcula/Predice el valor estimado de HOMA-IR basándote en estos parámetros.
      2. Clasifica el nivel de riesgo (Normal < 2.5, Resistencia Leve 2.5-4.0, Resistencia Severa > 4.0, o rangos ajustados según tu conocimiento experto).
      3. Provee una explicación fisiológica breve.
      4. Da 3 recomendaciones clínicas breves.

      Devuelve la respuesta estrictamente en formato JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            homaIndex: { type: Type.NUMBER, description: "El valor numérico predicho del HOMA-IR, con 2 decimales" },
            riskLevel: { type: Type.STRING, enum: ["Normal", "Resistencia Leve", "Resistencia Severa"] },
            riskColor: { type: Type.STRING, description: "Un código hex de color para UI: Verde para normal, Amarillo para leve, Rojo para severo" },
            explanation: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["homaIndex", "riskLevel", "riskColor", "explanation", "recommendations"],
        },
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(textResponse) as PredictionResult;
  } catch (error) {
    console.error("Error predicting HOMA-IR:", error);
    throw error;
  }
};