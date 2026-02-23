import { buildLegacyReviewPreview } from "@/lib/adapters/legacy-ui-adapter";
import type { HandHistory } from "@/types/domain";

const mockHand: HandHistory = {
  handId: "day1-preview-hand",
  sessionId: "session-day1",
  context: { toCall: 10, position: "BB" },
  timeline: [
    {
      type: "decision",
      index: 1,
      street: "preflop",
      actor: "hero",
      action: "call",
      grade: "Mistake",
      messageVi: "Call hơi loose ở spot này",
      recommendedAction: "fold",
    },
  ],
};

export async function ReviewOverview() {
  const text = await buildLegacyReviewPreview(mockHand);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Review Route Foundation</h2>
      <pre className="overflow-auto rounded border border-slate-700 bg-slate-900 p-4 text-xs text-slate-200">{text}</pre>
    </section>
  );
}
