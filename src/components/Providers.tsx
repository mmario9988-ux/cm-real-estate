"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
