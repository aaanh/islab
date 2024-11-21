import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="top-2 fixed justify-between items-center gap-2 grid grid-cols-[1fr_4fr] bg-background ml-4 px-4 border rounded-lg h-16 shrink-0">
      <SidebarTrigger className="-ml-1" />
      <Link
        className="flex items-center gap-2 hover:bg-primary/10 p-2 border rounded-lg transition-all ease-in-out"
        href="/studio"
      >
        <PencilIcon size={14} />
        <span>Content Studio</span>
      </Link>

    </header>
  );
}
