import { API_BASE_URL } from "@/apiServices/constants";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

// Chuyển đổi Quill Delta sang cấu trúc nội dung JSON tùy chỉnh.
export const convertDeltaToStructuredContent = (delta) => {
  const content = [];
  if (!delta || !delta.ops) return content;

  let currentList = null;
  let textBufferOps = [];

  const flushTextBufferToHtml = () => {
    if (textBufferOps.length === 0) return "";
    let htmlString = "";
    textBufferOps.forEach((op) => {
      let text = op.insert;
      if (op.attributes) {
        if (op.attributes.underline) text = `<u>${text}</u>`;
        if (op.attributes.italic) text = `<em>${text}</em>`;
        if (op.attributes.bold) text = `<strong>${text}</strong>`;
      }
      htmlString += text;
    });
    textBufferOps = [];
    return htmlString;
  };

  for (let i = 0; i < delta.ops.length; i++) {
    const op = delta.ops[i];

    if (op.insert === "\n") {
      const blockAttributes = op.attributes || {};
      const textForBlock = flushTextBufferToHtml();

      if (blockAttributes.header) {
        currentList = null;
        if (textForBlock.trim()) {
          content.push({
            type: "heading",
            data: { text: textForBlock, level: blockAttributes.header },
          });
        }
      } else if (blockAttributes.list) {
        if (textForBlock.trim()) {
          const isOrdered = blockAttributes.list === "ordered";
          if (
            !currentList ||
            currentList.data.ordered !== isOrdered ||
            !content.includes(currentList)
          ) {
            currentList = {
              type: "list",
              data: { items: [], ordered: isOrdered },
            };
            content.push(currentList);
          }
          currentList.data.items.push(textForBlock);
        }
      } else {
        currentList = null;
        if (textForBlock.trim()) {
          content.push({ type: "paragraph", data: { text: textForBlock } });
        }
      }
    } else if (op.insert && typeof op.insert.image === "string") {
      const precedingText = flushTextBufferToHtml();
      if (precedingText.trim()) {
        content.push({ type: "paragraph", data: { text: precedingText } });
      }
      currentList = null;
      content.push({
        type: "image",
        data: { url: op.insert.image, alt: "Product Introduction Image" },
      });
    } else if (typeof op.insert === "string") {
      textBufferOps.push(op);
    }
  }

  const remainingText = flushTextBufferToHtml();
  if (remainingText.trim()) {
    content.push({ type: "paragraph", data: { text: remainingText } });
  }

  return content.filter((block) => {
    if (
      block.type === "list" &&
      (!block?.data?.items || block?.data?.items?.length === 0)
    )
      return false;
    if (
      (block.type === "paragraph" || block.type === "heading") &&
      (!block.data.text || block.data.text.trim() === "")
    )
      return false;
    if (
      block.type === "image" &&
      (!block.data.url || block.data.url.trim() === "")
    )
      return false;
    return true;
  });
};

// Chuyển đổi cấu trúc nội dung JSON tùy chỉnh sang Quill Delta.
export const structuredContentToDelta = (contentStructure) => {
  const deltaOps = [];
  if (!contentStructure || contentStructure.length === 0) return { ops: [] };

  const parseHtmlToDeltaOps = (htmlString) => {
    const ops = [];
    if (
      typeof window === "undefined" ||
      !htmlString ||
      typeof htmlString !== "string"
    )
      return ops;

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, "text/html");
    const wrapper = doc.body.firstChild;

    function processNodes(childNodes, currentAttributes = {}) {
      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent) {
            ops.push({
              insert: node.textContent,
              attributes: { ...currentAttributes },
            });
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          let newAttributes = { ...currentAttributes };
          switch (node.tagName.toLowerCase()) {
            case "strong":
            case "b":
              newAttributes.bold = true;
              break;
            case "em":
            case "i":
              newAttributes.italic = true;
              break;
            case "u":
              newAttributes.underline = true;
              break;
          }
          processNodes(node.childNodes, newAttributes);
        }
      });
    }

    if (wrapper) {
      processNodes(wrapper.childNodes);
    } else if (htmlString.trim() !== "") {
      ops.push({ insert: htmlString });
    }
    return ops.filter(
      (op) =>
        op.insert !== "" ||
        (op.attributes && Object.keys(op.attributes).length > 0)
    );
  };

  contentStructure.forEach((block) => {
    if (block.type === "paragraph") {
      const parsedOps = parseHtmlToDeltaOps(block.data.text);
      if (parsedOps.length > 0) deltaOps.push(...parsedOps);
      deltaOps.push({ insert: "\n" });
    } else if (block.type === "heading") {
      const parsedOps = parseHtmlToDeltaOps(block.data.text);
      if (parsedOps.length > 0) deltaOps.push(...parsedOps);
      deltaOps.push({ insert: "\n", attributes: { header: block.data.level } });
    } else if (block.type === "list") {
      block?.data?.items.forEach((itemHtml) => {
        const parsedOps = parseHtmlToDeltaOps(itemHtml);
        if (parsedOps.length > 0) deltaOps.push(...parsedOps);
        deltaOps.push({
          insert: "\n",
          attributes: { list: block.data.ordered ? "ordered" : "bullet" },
        });
      });
    } else if (block.type === "image") {
      let imageUrl = block.data.url;
      if (imageUrl) {
        imageUrl = imageUrl.trim();
        if (
          imageUrl &&
          !imageUrl.startsWith("http://") &&
          !imageUrl.startsWith("https://") &&
          !imageUrl.startsWith("data:")
        ) {
          try {
            imageUrl = new URL(imageUrl, API_BASE_URL).href;
          } catch (error) {
            console.warn(
              "Failed to construct full image URL:",
              imageUrl,
              error
            );
            imageUrl = "";
          }
        }
        if (imageUrl) {
          deltaOps.push({ insert: { image: imageUrl } });
          deltaOps.push({ insert: "\n" });
        }
      }
    }
  });
  return { ops: deltaOps };
};

export const deltaToHtml = (delta) => {
  const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
  return converter.convert();
};

export const htmlToDelta = (html) => {
  if (!html || typeof html !== "string" || typeof window === "undefined") {
    return { ops: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const deltaOps = [];

  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) {
        deltaOps.push({ insert: text });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      switch (tagName) {
        case "p":
          processChildNodes(node);
          deltaOps.push({ insert: "\n" });
          break;

        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          processChildNodes(node);
          const level = parseInt(tagName.substring(1));
          deltaOps.push({ insert: "\n", attributes: { header: level } });
          break;

        case "ul":
          processListItems(node, "bullet");
          break;

        case "ol":
          processListItems(node, "ordered");
          break;

        case "strong":
        case "b":
          processStyledText(node, { bold: true });
          break;

        case "em":
        case "i":
          processStyledText(node, { italic: true });
          break;

        case "u":
          processStyledText(node, { underline: true });
          break;

        case "img":
          const src = node.getAttribute("src");
          if (src) {
            deltaOps.push({ insert: { image: src } });
            deltaOps.push({ insert: "\n" });
          }
          break;

        case "br":
          deltaOps.push({ insert: "\n" });
          break;

        default:
          processChildNodes(node);
          break;
      }
    }
  };

  const processChildNodes = (node) => {
    Array.from(node.childNodes).forEach(processNode);
  };

  const processListItems = (listNode, listType) => {
    const items = listNode.querySelectorAll("li");
    items.forEach((item) => {
      processChildNodes(item);
      deltaOps.push({ insert: "\n", attributes: { list: listType } });
    });
  };

  const processStyledText = (node, attributes) => {
    const textContent = node.textContent;
    if (textContent) {
      deltaOps.push({ insert: textContent, attributes });
    }
  };

  processChildNodes(body);

  // Loại bỏ các ops rỗng và merge các text ops liền kề
  const cleanedOps = [];
  let i = 0;
  while (i < deltaOps.length) {
    const op = deltaOps[i];
    if (typeof op.insert === "string" && op.insert === "") {
      i++;
      continue;
    }

    // Merge text ops liền kề có cùng attributes
    if (typeof op.insert === "string" && !op.insert.includes("\n")) {
      let mergedText = op.insert;
      let j = i + 1;

      while (
        j < deltaOps.length &&
        typeof deltaOps[j].insert === "string" &&
        !deltaOps[j].insert.includes("\n") &&
        JSON.stringify(op.attributes || {}) ===
          JSON.stringify(deltaOps[j].attributes || {})
      ) {
        mergedText += deltaOps[j].insert;
        j++;
      }

      if (mergedText) {
        cleanedOps.push({ insert: mergedText, attributes: op.attributes });
      }
      i = j;
    } else {
      cleanedOps.push(op);
      i++;
    }
  }

  return { ops: cleanedOps };
};
