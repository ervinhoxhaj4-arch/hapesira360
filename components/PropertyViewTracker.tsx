'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type PropertyViewTrackerProps = {
  propertyId: string;
};

function getVisitorId() {
  const storageKey = 'h360-visitor-id';
  const existing = localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const visitorId = crypto.randomUUID();
  localStorage.setItem(storageKey, visitorId);

  return visitorId;
}

export default function PropertyViewTracker({
  propertyId,
}: PropertyViewTrackerProps) {
  useEffect(() => {
    async function recordView() {
      try {
        const visitorId = getVisitorId();
        const viewKey = `h360-view-${propertyId}`;
        const previousView = sessionStorage.getItem(viewKey);

        if (previousView) {
          return;
        }

        const { error } = await supabase
          .from('property_views')
          .insert({
            property_id: propertyId,
            visitor_id: visitorId,
          });

        if (error) {
          console.warn('Property view error:', error.message);
          return;
        }

        sessionStorage.setItem(viewKey, 'true');
      } catch (error) {
        console.warn('Property view error:', error);
      }
    }

    void recordView();
  }, [propertyId]);

  return null;
}