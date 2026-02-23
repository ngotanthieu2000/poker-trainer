import { renderLegacyTablePreview } from "@/lib/adapters/legacy-ui-adapter";

export async function TableOverview() {
  const html = await renderLegacyTablePreview();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Table Route Foundation</h2>
      <p className="text-slate-300">Adapter đang tái sử dụng renderer cũ để giữ compatibility trong Day 1.</p>
      <div className="rounded border border-slate-700 bg-slate-900 p-4 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
