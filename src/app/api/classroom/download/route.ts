import { actor, failure, response, SpeechError } from "@/lib/speech/server";
import { classroomPackId } from "@/lib/classroom/catalog";
import { classroomAccess, CLASSROOM_BUCKET } from "@/lib/classroom/purchases";

export const dynamic = "force-dynamic";

// Purchased files only: a one-minute signed link to the private file.
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pack = classroomPackId(url.searchParams.get("pack"));
    const format = url.searchParams.get("format");
    if (!pack || (format !== "pptx" && format !== "pdf")) throw new SpeechError(400, "Unknown download.");
    const { db, user } = await actor(request);
    const { owned } = await classroomAccess(db, user.id);
    if (!owned.includes(pack)) throw new SpeechError(403, "This pack is not in your account yet.");
    const { data, error } = await db.storage.from(CLASSROOM_BUCKET)
      .createSignedUrl(`v1/${pack}.${format}`, 60, { download: `randomtopics-${pack}-classroom-pack.${format}` });
    if (error || !data?.signedUrl) throw new SpeechError(503, "The download is temporarily unavailable. Please try again.");
    return response({ url: data.signedUrl });
  } catch (error) {
    return failure(error);
  }
}
