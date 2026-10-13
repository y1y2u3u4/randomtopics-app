import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import MetadataRemover from "@/components/generators/MetadataRemover";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/ai-metadata-remover";
const TITLE = "AI Metadata Remover — Remove EXIF, C2PA & AI Prompts, No Upload";
const DESCRIPTION =
  "Free AI image metadata remover that works in your browser: see and remove EXIF, GPS location, camera details, XMP, IPTC, C2PA Content Credentials and Stable Diffusion or ComfyUI prompts from JPG, PNG and WebP files. Batch, lossless, nothing uploaded.";

const SOCIAL = generatorSocial({ card: "ai-metadata-remover", title: TITLE, description: DESCRIPTION, alt: "AI metadata remover — metadata found in an image and a clean copy" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ai metadata remover", "remove ai metadata", "ai image metadata remover", "remove c2pa metadata", "remove content credentials", "exif remover", "remove metadata from photo", "remove exif data", "stable diffusion metadata remover"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "What metadata does this remove?", answer: "EXIF (camera make and model, lens, serial numbers, dates, software), GPS location, XMP and IPTC fields, C2PA Content Credentials manifests, comments, and the text that AI image tools save in PNG files — for example Stable Diffusion “parameters” (prompt, seed, sampler) and ComfyUI prompt and workflow JSON. It works on JPG, PNG and WebP." },
  { question: "Are my images uploaded?", answer: "No. Files are read and cleaned entirely in your browser; nothing is sent to a server, and the page keeps nothing after you close it." },
  { question: "Does removing metadata change image quality?", answer: "No. The tool removes the metadata sections and copies the image data byte for byte — there is no re-compression. Colour profiles (ICC) are kept so colours look the same." },
  { question: "Can it remove invisible AI watermarks like SynthID?", answer: "No. Watermarks such as Google SynthID are hidden in the pixels themselves, not in the file's metadata. This tool does not remove them and does not try to. It is a privacy tool for the information stored alongside the image." },
  { question: "Should I still label AI-generated images?", answer: "Yes. Removing metadata does not change where an image came from. If a platform, school, client or law asks you to disclose AI-generated or AI-edited content, keep labelling it yourself." },
  { question: "Can I remove only the location?", answer: "Yes. Choose “Remove location only” to empty the GPS data and keep everything else, or “Remove location and camera details” to also clear make, model, lens and serial numbers." },
  { question: "Why remove Content Credentials (C2PA)?", answer: "Content Credentials can record who made a file, which tools edited it and when. That is useful for provenance, but it can also expose names, accounts and editing history you did not mean to share. Keep them when you want to prove a file's origin; remove them when you want to share less about yourself." },
];

export default function AiMetadataRemoverPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="AI Metadata Remover"
      heading={["AI Metadata", "Remover"]}
      intro="See what your images carry — location, device, AI prompts, Content Credentials — and download clean copies. In your browser, nothing uploaded."
      description={DESCRIPTION}
      updated="2026-10-13"
      faq={FAQ}
      inShort="Drop JPG, PNG or WebP files to see their hidden metadata — GPS location, camera and device details, editing software, C2PA Content Credentials and AI prompts saved by tools such as Stable Diffusion or ComfyUI — then download clean copies, one by one or as a ZIP. Everything happens in your browser, image quality does not change, and you can choose to remove only the location. It does not touch invisible watermarks in the pixels, and it is not a way to hide that an image is AI-generated."
      related={[
        { href: "/my-9-grid", label: "My 9 grid maker" },
        { href: "/random-color-generator", label: "Random color generator" },
        { href: "/random-drawing-generator", label: "Random drawing generator" },
      ]}
      content={
        <>
          <SectionTitle>Why remove image metadata before sharing?</SectionTitle>
          <p>
            Photos and AI images often carry more than you see. A phone photo can include the exact <strong>GPS location</strong> where it was taken and the device&apos;s make, model and serial number. AI tools can save the full <strong>prompt, seed and settings</strong> — and ComfyUI can save your whole workflow — inside a PNG. Editing apps add XMP history, and Content Credentials (C2PA) can record names and accounts. This <strong>AI metadata remover</strong> shows all of it and lets you share a copy without it.
          </p>
          <SectionTitle>What it reads and removes</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>JPG</strong>: EXIF (incl. GPS and maker notes), XMP, IPTC, C2PA/JUMBF manifests and comments.</li>
            <li><strong>PNG</strong>: text chunks (Stable Diffusion parameters, ComfyUI prompt and workflow, other generator data), eXIf, XMP, C2PA and timestamps.</li>
            <li><strong>WebP</strong>: EXIF, XMP and C2PA chunks, with the file header corrected.</li>
            <li><strong>Kept</strong>: the image data itself and the colour profile.</li>
          </ul>
          <SectionTitle>What it does not do</SectionTitle>
          <p>
            It does not alter pixels, so watermarks embedded in the image (such as SynthID) stay where they are, and visible labels or signatures stay too. It is meant for privacy — not for passing an AI image off as a photo. Where a platform or your school asks you to label AI content, keep doing so.
          </p>
          <SectionTitle>Tips</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Many social networks strip some metadata on upload, but not all, and files sent by email, chat or cloud links usually keep everything.</li>
            <li>Keep your original if you want to remember the prompt or settings — the clean copy is saved with “-clean” in its name.</li>
            <li>Making a collage to post? Clean the images first, then build it with the <Link href="/my-9-grid" className={linkClass}>My 9 grid maker</Link>.</li>
          </ul>
        </>
      }
    >
      <MetadataRemover />
    </GeneratorPageShell>
  );
}
