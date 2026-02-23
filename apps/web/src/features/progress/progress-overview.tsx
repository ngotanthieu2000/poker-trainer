import { computeLegacyProgressPreview } from "@/lib/adapters/legacy-ui-adapter";
import type { HandHistory } from "@/types/domain";

const sampleHands: HandHistory[] = [
  {
    handId: "h1",
    sessionId: "s1",
    startedAt: new Date().toISOString(),
    context: { position: "BB", toCall: 10 },
    timeline: [
      {
        type: "decision",
        index: 1,
        street: "preflop",
        actor: "hero",
        action: "fold",
        grade: "Good",
        messageVi: "Ổn",
        recommendedAction: "fold",
      },
    ],
  },
];

export async function ProgressOverview() {
  const stats = await computeLegacyProgressPreview(sampleHands);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Progress Route Foundation</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Hands" value={String(stats.summary.totalHands)} />
        <StatCard label="Total Decisions" value={String(stats.summary.totalDecisions)} />
        <StatCard label="Top Errors" value={String(stats.topErrors.length)} />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-900 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
