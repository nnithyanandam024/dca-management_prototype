import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // hackathon/demo only
});

export async function prioritizeCases(cases) {
  try {
    const casesData = cases.slice(0, 20).map(c => ({
      id: c.id,
      amount: c.amount,
      aging: c.aging,
      customerName: c.customerName,
      paymentHistory: c.paymentHistory || "unknown"
    }));

    const prompt = `
You are a debt collection AI analyst.

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT include explanations, headings, or text
- Do NOT use markdown
- Output must start with { and end with }

Cases:
${JSON.stringify(casesData, null, 2)}

Required JSON format:
{
  "analysis": [
    {
      "caseId": "CASE-001",
      "priorityScore": 85,
      "recoveryProbability": 0.78,
      "recommendedAction": "Immediate contact via phone",
      "reasoning": "High value with recent payment activity"
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "groq/compound-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const rawText = completion.choices[0].message.content;

    // ✅ SAFE JSON EXTRACTION
    const jsonMatch = rawText.match(/\{[\s\S]*\}$/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI prioritization error:", error);
    throw error;
  }
}
