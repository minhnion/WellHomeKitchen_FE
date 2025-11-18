import Image from "next/image";

const ContentBlock = ({ block }) => {
  switch (block.type) {
    case "heading":
      // Dùng dangerouslySetInnerHTML vì text có thể chứa thẻ <strong>, <em>...
      const HeadingTag = `h${block.data.level}`; // Tạo thẻ h2, h3, h4...
      return (
        <HeadingTag
          className="mt-8 mb-4 text-xl md:text-2xl lg:text-3xl"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      );

    case "paragraph":
      return (
        <p
          className="mb-6 leading-relaxed text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      );

    case "image":
      return (
        <figure className="my-8">
          <Image
            src={block.data.url}
            alt={block.data.alt || "Hình ảnh trong bài viết"}
            width={800}
            height={450}
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </figure>
      );

    case "list":
      const ListTag = block.data.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`mb-6 pl-5 space-y-2 ${
            block.data.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.data.items.map((item, index) => (
            <li
              key={index}
              className="text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ListTag>
      );

    default:
      return null;
  }
};

const PostContentRenderer = ({ content }) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <div className="prose lg:prose-xl max-w-full">
      {content.map((block) => (
        <ContentBlock key={block._id} block={block} />
      ))}
    </div>
  );
};

export default PostContentRenderer;
