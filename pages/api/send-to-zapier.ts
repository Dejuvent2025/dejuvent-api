import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get the webhook URL
  const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/21923957/27o0at2/";

  try {
    // Validate body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    // Send to Zapier
    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!zapierResponse.ok) {
      throw new Error(`Zapier request failed: ${zapierResponse.statusText}`);
    }

    res.status(200).json({ message: "Data sent to Zapier successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", data: error });
  }
}
