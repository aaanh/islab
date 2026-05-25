import {
  getMimeType,
  readPublicDirectory,
  renderDirectoryListing,
  resolvePublicPath,
} from "@/lib/directory-listing";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const segments = (await params).path ?? [];
  const resolvedPath = resolvePublicPath("downloads", segments);

  if (!resolvedPath) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const stat = await fs.stat(resolvedPath).catch(() => null);

  if (!stat) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (stat.isFile()) {
    const file = await fs.readFile(resolvedPath);
    return new NextResponse(file, {
      headers: { "Content-Type": getMimeType(resolvedPath) },
    });
  }

  const listing = await readPublicDirectory("downloads", "/downloads", segments);

  if (!listing) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(renderDirectoryListing(listing.title, listing.entries), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
