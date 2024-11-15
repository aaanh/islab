"use client";

import * as React from "react";
import logo from "../app/icon.png";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function AppLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          href="/"
          className="flex items-center gap-2 hover:bg-foreground/10 p-2 rounded-lg transition-all duration-200"
        >
          <div className="flex justify-center items-center bg-sidebar rounded-lg text-sidebar-primary-foreground aspect-square size-8">
            <Image src={logo} alt="Logo" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Inertial Sensing Lab</span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
