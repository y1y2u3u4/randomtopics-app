import { actor, failure, response, SpeechError } from "@/lib/speech/server";
import { classroomPackId, CLASSROOM_PACKS } from "@/lib/classroom/catalog";
import { classroomAccess } from "@/lib/classroom/purchases";
import { classroomContent, classroomSlides, PREVIEW_SLIDES } from "@/lib/classroom/content";

export const dynamic = "force-dynamic";

// Presenter mode: the whole pack for owners, the first few questions otherwise.
export async function GET(request: Request) {
  try {
    const pack = classroomPackId(new URL(request.url).searchParams.get("pack"));
    if (!pack) throw new SpeechError(400, "Unknown pack.");
    let full = false;
    if (request.headers.has("authorization")) {
      try {
        const { db, user } = await actor(request);
        full = (await classroomAccess(db, user.id)).owned.includes(pack);
      } catch {
        full = false; // An expired session still gets the preview.
      }
    }
    const slides = classroomSlides(pack);
    const content = classroomContent(pack);
    return response({
      pack,
      title: CLASSROOM_PACKS.find((p) => p.id === pack)!.title,
      color: content.color,
      full,
      total: slides.length,
      slides: full ? slides : slides.slice(0, PREVIEW_SLIDES),
    });
  } catch (error) {
    return failure(error);
  }
}
