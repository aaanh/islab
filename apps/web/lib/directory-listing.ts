import fs from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".zip": "application/zip",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function getMimeType(filePath: string) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

export function resolvePublicPath(publicSubdir: string, segments: string[]) {
  const publicRoot = path.join(process.cwd(), "public");
  const diskPath = path.join(publicRoot, publicSubdir, ...segments);
  const resolvedPath = path.resolve(diskPath);
  const resolvedRoot = path.resolve(publicRoot, publicSubdir);

  if (!resolvedPath.startsWith(resolvedRoot)) {
    return null;
  }

  return resolvedPath;
}

type ListingEntry = {
  name: string;
  href: string;
  isDirectory: boolean;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderDirectoryListing(title: string, entries: ListingEntry[]) {
  const items = entries
    .map((entry) => {
      const label = entry.isDirectory ? `${entry.name}/` : entry.name;
      return `<li><a href="${escapeHtml(entry.href)}">${escapeHtml(label)}</a></li>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; }
      h1 { font-size: 1.25rem; font-weight: 600; }
      ul { list-style: none; padding: 0; margin: 1rem 0 0; }
      li { margin: 0.25rem 0; }
      a { color: #0076ff; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <ul>${items}</ul>
  </body>
</html>`;
}

export async function readPublicDirectory(
  publicSubdir: string,
  urlPrefix: string,
  segments: string[] = []
) {
  const resolvedDir = resolvePublicPath(publicSubdir, segments);
  if (!resolvedDir) {
    return null;
  }

  const stat = await fs.stat(resolvedDir).catch(() => null);
  if (!stat?.isDirectory()) {
    return null;
  }

  const names = await fs.readdir(resolvedDir);
  const entries = await Promise.all(
    names.map(async (name) => {
      const entryPath = path.join(resolvedDir, name);
      const entryStat = await fs.stat(entryPath);
      const hrefSegments = [...segments, name];
      const href = `${urlPrefix}/${hrefSegments.map(encodeURIComponent).join("/")}${entryStat.isDirectory() ? "/" : ""}`;

      return {
        name,
        href,
        isDirectory: entryStat.isDirectory(),
      };
    })
  );

  entries.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const titlePath = [urlPrefix, ...segments].join("/") + "/";
  return {
    title: `Index of ${titlePath}`,
    entries,
  };
}
