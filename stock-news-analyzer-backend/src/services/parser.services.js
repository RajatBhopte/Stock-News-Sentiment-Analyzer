/**
 * Clean and normalize news headlines for AI processing
 */
export const cleanHeadline = (text) => {
  if (!text) return "";

  let cleaned = text
    // 1. Remove HTML entities (e.g., &amp; -> &)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')

    // 2. Remove common news source suffixes (e.g., " - Reuters")
    .replace(/\s*-\s*[\w\s]+News$/i, "")
    .replace(/\s*\|\s*[\w\s]+$/i, "")

    // 3. Remove URLs
    .replace(/https?:\/\/\S+/g, "")

    // 4. Remove extra spaces and newlines
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
};
