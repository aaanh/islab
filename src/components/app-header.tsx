import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="flex justify-between items-center gap-2 px-4 border-b h-16 shrink-0">
      <SidebarTrigger className="-ml-1" />
      <Link
        className="flex items-center gap-2 hover:bg-primary/10 p-2 rounded-lg transition-all ease-in-out"
        href="/studio"
      >
        <PencilIcon size={14} />
        <span>Content Studio</span>
      </Link>
    </header>
  );
}
