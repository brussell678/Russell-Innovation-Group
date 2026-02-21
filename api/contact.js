const RESEND_API_URL = "https://api.resend.com/emails";

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

function sanitize(value) {
  return String(value || "").trim();
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      env: {
        hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
        hasContactToEmail: Boolean(process.env.CONTACT_TO_EMAIL),
        hasContactFromEmail: Boolean(process.env.CONTACT_FROM_EMAIL)
      }
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let rawBody = req.body || {};
  if (typeof req.body === "string") {
    try {
      rawBody = JSON.parse(req.body || "{}");
    } catch (_error) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
  }
  const { name, email, organization, message, website } = rawBody;
  const clean = {
    name: sanitize(name),
    email: sanitize(email),
    organization: sanitize(organization),
    message: sanitize(message),
    website: sanitize(website)
  };

  if (clean.website) {
    // Honeypot hit: return success-like response to avoid bot feedback.
    return res.status(200).json({ ok: true });
  }

  if (!clean.name || !clean.email || !clean.organization || !clean.message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!isEmail(clean.email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (clean.message.length < 20) {
    return res.status(400).json({ error: "Message too short" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.CONTACT_TO_EMAIL || "brandon.t.russell77@gmail.com";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "RIG Website <onboarding@resend.dev>";

  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const text = [
    "New contact form submission",
    "",
    `Name: ${clean.name}`,
    `Email: ${clean.email}`,
    `Organization: ${clean.organization}`,
    "",
    "Message:",
    clean.message
  ].join("\n");

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: clean.email,
        subject: `Website Inquiry from ${clean.name}`,
        text
      })
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(502).json({
        error: "Failed to send email",
        details
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
};
