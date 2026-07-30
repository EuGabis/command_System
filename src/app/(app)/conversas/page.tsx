import ConversasInbox from "@/components/ConversasInbox";
import { listConversations } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function ConversasPage() {
  const conversas = await listConversations();
  return <ConversasInbox initial={conversas} />;
}
