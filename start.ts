import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame, TopBar } from "@/components/famio/ui";
import { mockMessages, mockChat, getProvider } from "@/lib/mock/data";
import { useState } from "react";
import { Send, Image as ImageIcon, Phone } from "lucide-react";

export const Route = createFileRoute("/messages/$id")({ component: Chat });

function Chat() {
  const { id } = Route.useParams();
  const meta = mockMessages.find((m) => m.id === id) || mockMessages[0];
  const p = getProvider(meta.providerId)!;
  const [msgs, setMsgs] = useState(mockChat[id] || []);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { id: Date.now().toString(), from: "me", text, time: "Now" }]);
    setText("");
  };

  return (
    <PhoneFrame bg="bg-surface-2">
      <TopBar
        back={{ to: "/messages" }}
        right={<button className="grid h-10 w-10 place-items-center rounded-full bg-surface shadow-soft"><Phone className="h-4 w-4" /></button>}
      />
      <div className="-mt-2 flex items-center gap-3 px-5 pb-3">
        <img src={p.avatar} className="h-12 w-12 rounded-2xl object-cover" />
        <div>
          <div className="text-base font-extrabold">{p.name}</div>
          <div className="text-[11px] text-success">● Online</div>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        <div className="mx-auto my-2 inline-block rounded-full bg-surface px-3 py-1 text-[11px] text-muted-foreground shadow-soft">Today</div>
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
              m.from === "me" ? "bg-navy text-navy-foreground rounded-br-md" : "bg-surface shadow-soft rounded-bl-md"
            }`}>
              {m.text}
              <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/60" : "text-muted-foreground"}`}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="safe-bottom border-t border-border bg-surface px-4 pt-3">
        <div className="flex items-center gap-2">
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2"><ImageIcon className="h-5 w-5 text-muted-foreground" /></button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message..."
            className="h-11 min-w-0 flex-1 rounded-full bg-surface-2 px-4 text-sm outline-none"
          />
          <button onClick={send} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral text-coral-foreground"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </PhoneFrame>
  );
}
