"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  const hasRecorded = useRef(false);

  useEffect(() => {
    // Ensure we only record a view once per component mount,
    // even if React Strict Mode double-invokes useEffect
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      
      fetch(`/api/properties/${propertyId}/view`, {
        method: "POST",
      }).catch((err) => {
        // Silently fail if view recording doesn't work so it doesn't break the UI
        console.error("View tracking failed", err);
      });
    }
  }, [propertyId]);

  return null; // This component doesn't render anything
}
