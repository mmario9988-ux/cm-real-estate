import en from "@/locales/en.json";
import th from "@/locales/th.json";
import { cookies, headers } from "next/headers";

type Language = "en" | "th";
const translations: Record<Language, any> = { en, th };

export async function getLanguage() {
  // 1. Check custom header set by middleware (for /en/path URLs)
  try {
    const headersList = await headers();
    const headerLang = headersList.get("x-language") as Language;
    if (headerLang === "en" || headerLang === "th") return headerLang;
  } catch(e) {}

  // 2. Fallback to cookie
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value as Language;
  return (lang === "en" || lang === "th") ? lang : "th";
}

export async function getTranslation(optionalLang?: Language) {
  const lang = optionalLang || await getLanguage();
  
  return (path: string) => {
    const keys = path.split(".");
    let result = translations[lang];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };
}
