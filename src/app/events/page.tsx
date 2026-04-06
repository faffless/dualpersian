"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { Event } from "@/lib/types";

function formatEventDate(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (timeStr) {
    return `${formatted} at ${timeStr}`;
  }
  return formatted;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      let query = supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true });

      if (cityFilter.trim()) {
        query = query.ilike("city", `%${cityFilter.trim()}%`);
      }

      const { data } = await query;
      if (data) {
        setEvents(data as Event[]);
      }
      setLoading(false);
    }
    fetchEvents();
  }, [cityFilter]);

  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-warm-brown flex items-center gap-2">
          Community Events <span className="text-primary text-lg">&#x2726;</span>
        </h1>
        <p className="text-muted text-sm mt-1 mb-6">
          Discover gatherings and events in the Persian diaspora community
        </p>

        {/* City filter */}
        <div className="parchment-card p-4 mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-muted mb-1">Filter by City</label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="warm-input w-full"
              placeholder="e.g. London, Los Angeles, Toronto..."
            />
          </div>
          {cityFilter && (
            <button
              onClick={() => setCityFilter("")}
              className="btn-outline text-sm px-4 py-2"
            >
              Clear
            </button>
          )}
        </div>

        <div className="ornament-divider mb-6">
          <span className="ornament-icon">&#x2726;</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="font-heading text-xl mb-2">No upcoming events</p>
            <p className="text-sm">
              {cityFilter ? "Try a different city or clear the filter" : "Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="parchment-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {event.image_url && (
                    <div className="aspect-video bg-warm-border/30">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="font-heading text-lg font-semibold text-warm-brown mb-1 line-clamp-2">
                      {event.title}
                    </h2>
                    <p className="text-sm text-muted mb-2">
                      {formatEventDate(event.event_date, event.event_time)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <span>{event.city}, {event.country}</span>
                      {event.venue && (
                        <>
                          <span>&middot;</span>
                          <span className="truncate">{event.venue}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
