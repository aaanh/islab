import type { Metadata } from "next";
import { Figtree, Geist_Mono, Oxanium } from "next/font/google";

import "../globals.css";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const figtree = Figtree({ subsets: ["latin"], variable: "--font-content" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inertial Sensing Lab",
  description: "Explorations in motion and perception",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-content",
        fontMono.variable,
        oxanium.variable,
        figtree.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
