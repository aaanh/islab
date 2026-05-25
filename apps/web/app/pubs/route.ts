import { readPublicDirectory, renderDirectoryListing } from "@/lib/directory-listing";
import { NextResponse } from "next/server";

export async function GET() {
  const listing = await readPublicDirectory("pubs", "/pubs");

  if (!listing) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(renderDirectoryListing(listing.title, listing.entries), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
