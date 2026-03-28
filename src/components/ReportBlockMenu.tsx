"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

const REPORT_REASONS = [
  "Fake profile",
  "Inappropriate photos",
  "Harassment or abuse",
  "Spam or scam",
  "Underage user",
  "Other",
];

export default function ReportBlockMenu({
  targetUserId,
  targetUserName,
  onBlock,
}: {
  targetUserId: string;
  targetUserName: string;
  onBlock?: () => void;
}) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const handleReport = async () => {
    if (!user || !reason) return;
    setSubmitting(true);
    await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_user_id: targetUserId,
      reason,
      details: details || null,
    });
    setSubmitting(false);
    setShowReport(false);
    setDone("Report submitted. We'll review it shortly.");
    setTimeout(() => setDone(null), 3000);
  };

  const handleBlock = async () => {
    if (!user) return;
    setSubmitting(true);
    await supabase.from("blocks").insert({
      blocker_id: user.id,
      blocked_user_id: targetUserId,
    });
    setSubmitting(false);
    setShowMenu(false);
    setDone(`${targetUserName} has been blocked.`);
    onBlock?.();
    setTimeout(() => setDone(null), 3000);
  };

  if (done) {
    return (
      <div className="bg-accent/10 text-accent px-3 py-2 rounded-lg text-xs">
        {done}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-muted hover:text-warm-brown text-lg px-2"
        title="More options"
      >
        ⋯
      </button>

      {showMenu && !showReport && (
        <div className="absolute right-0 top-8 bg-cream-light border border-warm-border rounded-lg shadow-lg z-50 w-44 overflow-hidden">
          <button
            onClick={() => { setShowReport(true); setShowMenu(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-warm-brown hover:bg-warm-border/20 transition-colors"
          >
            Report {targetUserName}
          </button>
          <button
            onClick={handleBlock}
            disabled={submitting}
            className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors border-t border-warm-border"
          >
            {submitting ? "Blocking..." : `Block ${targetUserName}`}
          </button>
          <button
            onClick={() => setShowMenu(false)}
            className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-warm-border/20 transition-colors border-t border-warm-border"
          >
            Cancel
          </button>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-warm-brown/60 flex items-center justify-center z-[60] p-4">
          <div className="parchment-card p-6 max-w-sm w-full">
            <h3 className="font-heading text-lg font-bold text-warm-brown mb-1">
              Report {targetUserName}
            </h3>
            <p className="text-xs text-muted mb-4">
              This will be reviewed by our team.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-warm-brown mb-1">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="warm-input text-sm"
                >
                  <option value="">Select a reason...</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-brown mb-1">
                  Details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="warm-input text-sm resize-none"
                  rows={3}
                  placeholder="Any additional context..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowReport(false); setReason(""); setDetails(""); }}
                  className="btn-outline flex-1 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  disabled={!reason || submitting}
                  className="btn-terracotta flex-1 py-2 text-sm"
                >
                  {submitting ? "Sending..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
