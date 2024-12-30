export const convertMdToHtml = (md: string) => {
  // Convert markdown links to HTML anchor tags
  const htmlWithLinks = md.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, text, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#00FF94] hover:underline">${text}</a>`
  );

  // Wrap non-link text in paragraphs, but avoid wrapping existing HTML elements
  const segments = htmlWithLinks.split(/(<[^>]+>)/);
  const processedSegments = segments.map((segment) => {
    // If segment is HTML tag, leave it unchanged
    if (segment.startsWith("<")) {
      return segment;
    }
    // If segment is text content and not empty, wrap in <p>
    if (segment.trim()) {
      return `<p>${segment}</p>`;
    }
    return segment;
  });

  return processedSegments.join("");
};
