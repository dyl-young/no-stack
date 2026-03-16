import { redirect } from "next/navigation";

export default function ChatPage() {
  redirect(`/dashboard/chat/${crypto.randomUUID()}`);
}
