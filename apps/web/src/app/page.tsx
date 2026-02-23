import { getDictionary } from "@/lib/i18n";

export default async function HomePage() {
  const dict = await getDictionary("vi");

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">{dict.page.title}</h2>
      <p className="text-slate-300">{dict.page.subtitle}</p>
      <p className="text-sm text-slate-400">{dict.page.underConstruction}</p>
    </section>
  );
}
