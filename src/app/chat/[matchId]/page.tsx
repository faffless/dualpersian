"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import type { Message, Profile } from "@/lib/types";
import Link from "next/link";
import ReportBlockMenu from "@/components/ReportBlockMenu";

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (!user || !matchId) return;
    const init = async () => {
      const { data: match } = await supabase.from("matches").select("*").eq("id", matchId).single();
      if (!match || (match.user1 !== user.id && match.user2 !== user.id)) { router.push("/matches"); return; }
      const otherId = match.user1 === user.id ? match.user2 : match.user1;
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", otherId).single();
      setOtherUser(profile);
      const { data: msgs } = await supabase.from("messages").select("*").eq("match_id", matchId).order("created_at", { ascending: true });
      setMessages(msgs || []);
      setLoading(false);
    };
    init();
    const channel = supabase.channel(`messages:${matchId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` }, (payload) => {
      const newMsg = payload.new as Message;
      setMessages((prev) => { if (prev.some((m) => m.id === newMsg.id)) return prev; return [...prev, newMsg]; });
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, authLoading, matchId, router]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");
    await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, content });
    setSending(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-62px)]">
      {/* Chat Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-warm-border" style={{
        backgroundImage: "url('/textures/cream-border.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "soft-light",
        backgroundColor: "#FAF6F1",
      }}>
        <Link href="/matches" className="text-muted hover:text-warm-brown transition-colors text-lg">←</Link>
        {otherUser?.avatar_url ? (
          <img src={otherUser.avatar_url} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-warm-border" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-warm-border/30 flex items-center justify-center text-lg font-heading font-medium text-muted border-2 border-warm-border">
            {otherUser?.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex-1">
          <p className="font-heading font-semibold text-warm-brown">{otherUser?.name}</p>
          <p className="text-xs text-muted">{otherUser?.city}, {otherUser?.country}</p>
        </div>
        {otherUser && (
          <ReportBlockMenu
            targetUserId={otherUser.id}
            targetUserName={otherUser.name}
            onBlock={() => router.push("/matches")}
          />
        )}
      </div>

      <div className="terracotta-strip" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{
        backgroundImage: "url('/textures/cream-border-2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "soft-light",
        backgroundColor: "#F5EDE3",
      }}>
        {messages.length === 0 && (
          <div className="text-center text-muted py-10">
            <p className="font-heading">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                isMe
                  ? "bg-primary text-white rounded-br-md"
                  : "msg-received text-warm-brown rounded-bl-md"
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="terracotta-strip" />
      <form onSubmit={handleSend} className="px-4 py-3 flex gap-2" style={{
        backgroundImage: "url('/textures/cream-border.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "soft-light",
        backgroundColor: "#FAF6F1",
      }}>
        <input
          type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-warm-border bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
        />
        <button type="submit" disabled={!newMessage.trim() || sending}
          className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-full font-medium text-sm transition-colors disabled:opacity-50"
        >Send</button>
      </form>
    </div>
  );
}
