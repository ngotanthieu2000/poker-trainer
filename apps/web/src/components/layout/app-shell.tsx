import Link from "next/link";

type NavItem = { href: string; label: string };

interface AppShellProps {
  title: string;
  children: React.ReactNode;
  nav: NavItem[];
}

export function AppShell({ title, children, nav }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          <nav className="flex gap-4 text-sm text-slate-300">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
