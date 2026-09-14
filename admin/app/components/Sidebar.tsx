"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, MicIcon, BookIcon, ScrollIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/reciters", label: "Reciters", icon: MicIcon, exact: false },
  { href: "/tafsirs", label: "Tafsirs", icon: ScrollIcon, exact: false },
  { href: "/scholars", label: "Scholars", icon: BookIcon, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B6F47] text-sm font-bold text-white">
          CA
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-900">
            Content Admin
          </p>
          <p className="text-xs leading-tight text-slate-400">
            Muhammed-Okasha
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[#8B6F47]/[0.06] text-[#6b552f]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#8B6F47]" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-6 py-5">
        <p className="text-xs text-slate-400">
          Changes here update the live app within moments — no rebuild
          needed.
        </p>
      </div>
    </aside>
  );
}
