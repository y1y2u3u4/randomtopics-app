"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/track";

export default function PartyFlowLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} onClick={(event) => {
    props.onClick?.(event);
    if (event.defaultPrevented) return;
    if (!["/es/most-likely-to", "/es/topics/most-likely-to-questions"].includes(window.location.pathname)) return;
    const toTool = props.href === "/es/most-likely-to";
    const toArticle = String(props.href).startsWith("/es/topics/most-likely-to-questions");
    if (toTool || toArticle) track(toTool ? "party_article_to_tool" : "party_tool_to_article", {
      content_source: toTool ? "es_most_likely_article" : "es_most_likely_tool", locale: "es",
    });
  }} />;
}
