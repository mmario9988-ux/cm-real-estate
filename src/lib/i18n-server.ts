import en from "@/locales/en.json";
import th from "@/locales/th.json";
import { cookies } from "next/headers";

type Language = "en" | "th";
const translations: Record<Language, any> = { en, th };

export async function getLanguage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value as Language;
  return (lang === "en" || lang === "th") ? lang : "th";
}

export async function getTranslation() {
  const lang = await getLanguage();
  
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
