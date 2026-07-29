import type { WhatsAppCredentials, InstagramCredentials } from "./types";

const GRAPH = "https://graph.facebook.com/v21.0";

/* ---------- WhatsApp Cloud API ---------- */

export async function whatsappSendText(
  creds: WhatsAppCredentials,
  to: string,
  text: string,
): Promise<void> {
  const res = await fetch(`${GRAPH}/${creds.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
  if (!res.ok) {
    throw new Error(`WhatsApp send falhou: ${res.status} ${await res.text()}`);
  }
}

export async function whatsappTest(creds: WhatsAppCredentials): Promise<void> {
  const res = await fetch(`${GRAPH}/${creds.phoneNumberId}?fields=verified_name,display_phone_number`, {
    headers: { Authorization: `Bearer ${creds.accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Credenciais WhatsApp inválidas: ${res.status} ${await res.text()}`);
  }
}

/* ---------- Instagram Messaging (Graph API) ---------- */

export async function instagramSendText(
  creds: InstagramCredentials,
  recipientId: string,
  text: string,
): Promise<void> {
  const res = await fetch(`${GRAPH}/${creds.igBusinessId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });
  if (!res.ok) {
    throw new Error(`Instagram send falhou: ${res.status} ${await res.text()}`);
  }
}

export async function instagramTest(creds: InstagramCredentials): Promise<void> {
  const res = await fetch(`${GRAPH}/${creds.igBusinessId}?fields=username,name`, {
    headers: { Authorization: `Bearer ${creds.accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Credenciais Instagram inválidas: ${res.status} ${await res.text()}`);
  }
}
