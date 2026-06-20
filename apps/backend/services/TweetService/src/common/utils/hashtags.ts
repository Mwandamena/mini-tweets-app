export function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  const hashtags = content.match(hashtagRegex);

  if (!hashtags) return [];
  return [...new Set(hashtags.map((tag) => tag.slice(1).toLowerCase()))];
}
