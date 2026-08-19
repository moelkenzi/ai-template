import ChatTemplate from "@/components/smoothui/chat-template";

export default function AiPage() {
  // A chat app owns the viewport. The template fills whatever box you give it,
  // and its panes scroll internally — the page itself never scrolls.
  return (
    <main className="h-dvh">
      <ChatTemplate />
    </main>
  );
}