import { PortableText } from "@portabletext/react";
import urlBuilder from "@sanity/image-url";
import { getImageDimensions } from "@sanity/asset-utils";
import { dataset, projectId } from "@/sanity/env";

const ImageComponent = ({
  value,
  isInline,
}: {
  value: any;
  isInline: boolean;
}) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      src={urlBuilder({ projectId: projectId, dataset: dataset })
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  );
};

const components = {
  types: {
    image: ({ value, isInline }: { value: any; isInline: boolean }) => {
      return <ImageComponent value={value} isInline={isInline} />;
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRender({ blocks }: { blocks: any }) {
  return (
    <section className="portable-text">
      <PortableText value={blocks} components={components} />
    </section>
  );
}
