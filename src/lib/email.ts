import type { EmailSubscriber } from "@/types/review";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

async function subscribeViaBeehiiv(email: string): Promise<void> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) return;

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Beehiiv error: ${body}`);
  }
}

async function subscribeViaMailchimp(email: string): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !serverPrefix) return;

  const res = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    },
  );

  if (!res.ok && res.status !== 400) {
    const body = await res.text();
    throw new Error(`Mailchimp error: ${body}`);
  }
}

export async function syncSubscriberToEsp(email: string): Promise<{
  provider: "beehiiv" | "mailchimp" | "local";
}> {
  if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
    await subscribeViaBeehiiv(email);
    return { provider: "beehiiv" };
  }

  if (
    process.env.MAILCHIMP_API_KEY &&
    process.env.MAILCHIMP_AUDIENCE_ID &&
    process.env.MAILCHIMP_SERVER_PREFIX
  ) {
    await subscribeViaMailchimp(email);
    return { provider: "mailchimp" };
  }

  return { provider: "local" };
}

export type { EmailSubscriber };
