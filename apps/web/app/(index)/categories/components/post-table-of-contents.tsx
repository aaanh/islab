type PostTableOfContentsProps = {
  title: string;
  items: { text: string; id: string }[];
};

export function PostTableOfContents({
  title,
  items,
}: PostTableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <aside className="not-prose my-8 max-w-xl">
      <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-1.5 border-l-2 border-border pl-4">
        {items.map((header) => (
          <li key={header.id}>
            <a
              href={`#${header.id}`}
              className="text-sm text-foreground/85 leading-snug transition-colors hover:text-primary"
            >
              {header.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
