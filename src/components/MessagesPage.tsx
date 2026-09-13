import { useState } from "react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";

export function MessagesPage() {
  const { currentUser, conversations, users, products, sendMessage } = useStore();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [text, setText] = useState("");

  if (!currentUser) return null;

  const userConversations = conversations.filter((c) =>
    c.participants.includes(currentUser.id)
  );

  const getOtherUser = (conv: (typeof conversations)[0]) => {
    const otherId = conv.participants.find((id) => id !== currentUser.id);
    return users.find((u) => u.id === otherId);
  };

  const getProduct = (conv: (typeof conversations)[0]) => {
    return conv.productId ? products.find((p) => p.id === conv.productId) : null;
  };

  const activeConv = userConversations.find((c) => c.id === activeConvId);

  const handleSend = () => {
    if (!activeConvId || !text.trim()) return;
    sendMessage(activeConvId, currentUser.id, text.trim());
    setText("");
  };

  if (activeConv) {
    const otherUser = getOtherUser(activeConv);
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col p-4">
        <button onClick={() => setActiveConvId(null)} className="mb-3 text-sm text-emerald-700">
          ← رجوع للمحادثات
        </button>
        <p className="mb-3 font-medium text-slate-900">{otherUser?.name}</p>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {activeConv.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  msg.senderId === currentUser.id
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالة..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <MessageCircle className="h-5 w-5 text-emerald-700" />
        الرسائل
      </h1>

      {userConversations.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">لا توجد محادثات حالياً</p>
      ) : (
        <div className="flex flex-col gap-2">
          {userConversations.map((conv) => {
            const otherUser = getOtherUser(conv);
            const product = getProduct(conv);
            const lastMessage = conv.messages[conv.messages.length - 1];
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-right"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                  {otherUser?.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{otherUser?.name}</p>
                  {product && <p className="text-xs text-slate-400">{product.title}</p>}
                  {lastMessage && (
                    <p className="truncate text-xs text-slate-500">{lastMessage.content}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
