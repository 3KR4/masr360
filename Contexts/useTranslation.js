import { mainContext } from "@/Contexts/mainContext";
import ar from "../lang/ar";
import en from "../lang/en";
import { useContext } from "react";

export default function useTranslate() {
  const { locale } = useContext(mainContext);
  return locale === "ar" ? ar : en;
}
