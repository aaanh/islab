const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  css: "CSS",
  go: "Go",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  md: "Markdown",
  mdx: "MDX",
  python: "Python",
  py: "Python",
  rust: "Rust",
  shell: "Shell",
  sh: "Shell",
  sql: "SQL",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  yaml: "YAML",
  yml: "YAML",
  zsh: "Zsh",
};

export function formatCodeLanguage(language: string): string {
  const key = language.trim().toLowerCase();
  if (LANGUAGE_LABELS[key]) return LANGUAGE_LABELS[key];

  return key
    .split(/[-_+.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
