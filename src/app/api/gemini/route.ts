import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, model, temperature, topP, maxOutputTokens, systemInstruction, prompt } = body;

    if (!apiKey || !prompt) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: apiKey y prompt" },
        { status: 400 }
      );
    }

    const requestBody: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature ?? 0.7,
        topP: topP ?? 0.9,
        maxOutputTokens: maxOutputTokens ?? 8192,
      },
    };

    if (systemInstruction?.trim()) {
      requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || `Error de API: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno del servidor proxy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}