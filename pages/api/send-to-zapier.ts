import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL || "https://hooks.zapier.com/hooks/catch/21923957/27o0at2/";

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const responseData = await zapierResponse.text();

    return res.status(200).json({
      message: "Successfully sent to Zapier",
      data: responseData,
    });
  } catch (error) {
    console.error("Error forwarding to Zapier:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
