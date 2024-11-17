import { PeopleType } from "@/api/people";
import PortableTextRender from "@/components/portable-text-render";
import Image from "next/image";

export default function PeopleCard({ author }: { author: PeopleType }) {
  return (
    <div className="gap-4 grid grid-cols-[1fr_1fr] border rounded-lg divide-x min-h-36">
      <div className="flex flex-col gap-2 p-4">
        <h3>{author.name}</h3>
        {author.image ? (
          <Image src={author.image} alt={author.name} />
        ) : (
          <Image
            className="border rounded-full"
            width={64}
            height={64}
            src="/placeholder.png"
            alt={author.name}
          />
        )}
        <p className="text-muted-foreground">{author.affiliation}</p>
        <ul className="flex gap-2">
          {author.extern_links?.map((link) => (
            <li key={link.site}>
              <a
                className="text-primary underline underline-offset-2"
                href={link.url}
              >
                {link.site}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <PortableTextRender blocks={author.bio}></PortableTextRender>
      </div>
    </div>
  );
}
