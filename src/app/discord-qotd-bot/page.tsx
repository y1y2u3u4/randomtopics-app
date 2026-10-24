import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FactTable from "@/components/FactTable";
import BotSetup from "@/components/subs/BotSetup";
import LandingView from "@/components/subs/LandingView";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/discord-qotd-bot";
const TITLE = "Discord QOTD Bot — Question of the Day for Your Server";
const DESCRIPTION =
  "A Discord QOTD bot that posts a question of the day to your server channel through a webhook. Pick the category, days and time. Also works with Slack and Teams. 7 days free, then $7/month.";


export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["discord qotd bot", "discord question of the day bot", "qotd discord", "discord daily question bot", "discord icebreaker bot"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  { question: "How do I set up a QOTD bot for my Discord server?", answer: "Open Server Settings, then Integrations, then Webhooks, create a webhook for your QOTD channel and copy its URL. Paste it into the form on this page, choose the category, days and hour, and the bot posts a test question right away." },
  { question: "Do I need to invite a bot to my server?", answer: "No. It posts through the channel webhook you create, so there is no bot user to invite and no permission to read messages. Delete the webhook in Discord and it stops." },
  { question: "Will it ping @everyone?", answer: "No. Messages are sent with mentions switched off, so a question can never ping anyone." },
  { question: "How much does it cost?", answer: "The first 7 days are free with no card. After that the bot is $7 per month or $59 per year for a workspace, with up to 3 channels. Prices are in US dollars." },
  { question: "Can I cancel any time?", answer: "Yes. Cancel from the billing link in your receipt email and the plan runs to the end of the period you paid for. Remove a channel on this page whenever you like and the bot stops posting there." },
  { question: "What happens when the free week ends?", answer: "The bot stops posting and this page says sending is paused. Nothing is deleted. Pick a plan and it resumes at the next scheduled time." },
  { question: "Will it repeat questions?", answer: "Not until it has used every question in the category you chose. Each channel goes through the list in its own shuffled order." },
  { question: "Does it work with Slack or Teams?", answer: "Yes. Choose Slack or Microsoft Teams in the form if you also want the question in a work chat. The steps for each webhook are on this page." },
];

export default function Page() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Discord QOTD Bot"
      heading={["Discord QOTD", "Bot"]}
      intro="Post a question of the day to your Discord server every day at the time you choose. Works with Slack and Teams too. Free for 7 days."
      description={DESCRIPTION}
      updated="2026-10-24"
      faq={FAQ}
      inShort="This Discord QOTD bot posts a question of the day to a channel in your server through a webhook, daily, on weekdays or weekly at the hour you pick. Paste the webhook URL, choose a category and it sends a test straight away. It also works with Slack and Microsoft Teams. The first 7 days are free; then it is $7 a month or $59 a year, up to 3 channels."
      related={[
        { href: "/question-of-the-day", label: "Question of the day" },
        { href: "/this-or-that/work", label: "This or that questions for work" },
        { href: "/icebreaker", label: "Icebreaker questions" },
        { href: "/decision-maker", label: "Decision maker" },
      ]}
      afterTool={
        <FactTable
          heading="Team Icebreaker Bot at a glance"
          columns={["", "Details"]}
          rows={[
            ["Works with", "Slack, Discord and Microsoft Teams (through a webhook URL you create)"],
            ["Free", "7 days from your first channel, no card needed"],
            ["Paid plan", "$7/month or $59/year per workspace, cancel any time"],
            ["Channels", "Up to 3 channels per plan"],
            ["You choose", "Question category, days (daily, weekdays or Mondays), hour and time zone"],
            ["Repeats", "None until every question in the category has been used"],
            ["Needs", "Permission to add a webhook or workflow in your workspace. No app install, no bot user, no read access to messages"],
          ]}
        />
      }
      content={
        <>
          <LandingView product="bot" />
          <SectionTitle>How to get your webhook URL</SectionTitle>
          <p><strong>Discord</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Open <strong>Server Settings → Integrations → Webhooks</strong> (you need the Manage Webhooks permission).</li>
            <li>Choose <strong>New Webhook</strong> and pick the channel it should post in.</li>
            <li>Choose <strong>Copy Webhook URL</strong>. It looks like https://discord.com/api/webhooks/&lt;id&gt;/&lt;token&gt;.</li>
          </ol>
          <p className="mt-3"><strong>Slack</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to api.slack.com/apps and choose <strong>Create New App</strong>, then <strong>From scratch</strong>.</li>
            <li>Open <strong>Incoming Webhooks</strong>, switch it on and choose <strong>Add New Webhook to Workspace</strong>.</li>
            <li>Pick the channel and copy the URL that starts with https://hooks.slack.com/services/.</li>
            <li>No admin rights? In Workflow Builder, start a workflow <strong>From a webhook</strong> and copy its web request URL (hooks.slack.com/triggers/…); add a message step that uses the variable the trigger receives.</li>
          </ol>
          <p className="mt-3"><strong>Microsoft Teams</strong></p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>In Teams, open the <strong>Workflows</strong> app and choose <strong>Post to a channel when a webhook request is received</strong>.</li>
            <li>Pick the team and channel, then create the workflow.</li>
            <li>Copy the HTTP URL it shows (a .logic.azure.com or .environment.api.powerplatform.com address).</li>
          </ol>
          <p className="mt-3">Paste the URL into the form above, choose when to post, and the bot sends a test question straight away.</p>
          <SectionTitle>What the bot posts</SectionTitle>
          <p>
            One question per post, with a small “via randomtopics.app” link. Pick a category: work and team, funny and light, deep and
            reflective, this-or-that, classroom or kids and family, or a mix. The same questions are free to browse in the{" "}
            <Link href="/question-of-the-day" className={linkClass}>question of the day</Link> and{" "}
            <Link href="/this-or-that/work" className={linkClass}>work this-or-that</Link> lists.
          </p>
        </>
      }
    >
      <BotSetup defaultPlatform="discord" />
    </GeneratorPageShell>
  );
}
