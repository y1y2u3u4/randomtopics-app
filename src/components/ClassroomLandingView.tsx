"use client";
import { useEffect } from "react";
import { trackClassroom } from "@/lib/classroom/client";

export default function ClassroomLandingView() {
  useEffect(() => { trackClassroom("classroom_pack_card_view", { pack: "all", page: "/classroom-packs" }); }, []);
  return null;
}
