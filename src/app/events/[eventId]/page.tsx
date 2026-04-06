"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Event, EventRsvp } from "@/lib/types";

function formatEventDate(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (timeStr) {
    return `${formatted} at ${timeStr}`;
  }
  return formatted;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [myRsvp, setMyRsvp] = useState<EventRsvp | null>(null);
  const [rsvpCounts, setRsvpCounts] = useState({ interested: 0, going: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Fetch event
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (!eventData) {
        setLoading(false);
        return;
      }
      setEvent(eventData as Event);

      // Fetch RSVP counts
      const { data: goingData } = await supabase
        .from("event_rsvps")
        .select("id", { count: "exact" })
        .eq("event_id", eventId)
        .eq("status", "going");

      const { data: interestedData } = await supabase
        .from("event_rsvps")
        .select("id", { count: "exact" })
        .eq("event_id", eventId)
        .eq("status", "interested");

      setRsvpCounts({
        going: goingData?.length ?? 0,
        interested: interestedData?.length ?? 0,
      });

      // Fetch user's RSVP
      if (user) {
        const { data: rsvpData } = await supabase
          .from("event_rsvps")
          .select("*")
          .eq("event_id", eventId)
          .eq("user_id", user.id)
          .single();

        if (rsvpData) {
          setMyRsvp(rsvpData as EventRsvp);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, [eventId, user]);

  const handleRsvp = async (status: "interested" | "going") => {
    if (!user) return;
    setSubmitting(true);

    if (myRsvp) {
      if (myRsvp.status === status) {
        // Remove RSVP
        await supabase.from("event_rsvps").delete().eq("id", myRsvp.id);
        setRsvpCounts((prev) => ({
          ...prev,
          [status]: prev[status] - 1,
        }));
        setMyRsvp(null);
      } else {
        // Update RSVP
        const { data } = await supabase
          .from("event_rsvps")
          .update({ status })
          .eq("id", myRsvp.id)
          .select()
          .single();

        if (data) {
          setRsvpCounts((prev) => ({
            ...prev,
            [myRsvp.status]: prev[myRsvp.status] - 1,
            [status]: prev[status] + 1,
          }));
          setMyRsvp(data as EventRsvp);
        }
      }
    } else {
      // Insert new RSVP
      const { data } = await supabase
        .from("event_rsvps")
        .insert({ event_id: eventId, user_id: user.id, status })
        .select()
        .single();

      if (data) {
        setRsvpCounts((prev) => ({
          ...prev,
          [status]: prev[status] + 1,
        }));
        setMyRsvp(data as EventRsvp);
      }
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-cream">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="font-heading text-xl text-warm-brown">Event not found</p>
          <Link href="/events" className="text-primary text-sm mt-2 inline-block">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted mb-4">
          <Link href="/events" className="hover:text-warm-brown">Events</Link>
          <span className="mx-2">/</span>
          <span className="text-warm-brown truncate">{event.title}</span>
        </div>

        <div className="parchment-card overflow-hidden">
          {/* Event image */}
          {event.image_url && (
            <div className="aspect-video max-h-80 bg-warm-border/30">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="font-heading text-3xl font-bold text-warm-brown mb-3">
              {event.title}
            </h1>

            <div className="ornament-divider mb-6">
              <span className="ornament-icon">&#x2726;</span>
            </div>

            {/* Details grid */}
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted">Date</p>
                  <p className="text-sm text-warm-brown">
                    {formatEventDate(event.event_date, event.event_time)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted">Location</p>
                  <p className="text-sm text-warm-brown">
                    {event.city}, {event.country}
                  </p>
                </div>
                {event.venue && (
                  <div>
                    <p className="text-xs font-medium text-muted">Venue</p>
                    <p className="text-sm text-warm-brown">{event.venue}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted">Attendees</p>
                  <p className="text-sm text-warm-brown">
                    {rsvpCounts.going} going &middot; {rsvpCounts.interested} interested
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-warm-brown leading-relaxed whitespace-pre-wrap mb-8">
              {event.description}
            </div>

            {/* RSVP buttons */}
            {user ? (
              <div className="flex gap-3">
                <button
                  onClick={() => handleRsvp("interested")}
                  disabled={submitting}
                  className={`flex-1 py-3 text-sm rounded-lg transition-colors ${
                    myRsvp?.status === "interested"
                      ? "btn-terracotta"
                      : "btn-outline"
                  }`}
                >
                  {myRsvp?.status === "interested" ? "&#x2713; Interested" : "Interested"}
                </button>
                <button
                  onClick={() => handleRsvp("going")}
                  disabled={submitting}
                  className={`flex-1 py-3 text-sm rounded-lg transition-colors ${
                    myRsvp?.status === "going"
                      ? "btn-terracotta"
                      : "btn-outline"
                  }`}
                >
                  {myRsvp?.status === "going" ? "&#x2713; Going" : "Going"}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted text-sm mb-3">Sign in to RSVP</p>
                <Link href="/login" className="btn-terracotta text-sm px-6 py-2 inline-block">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
