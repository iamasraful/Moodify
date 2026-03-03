// iTunes Search API — no auth, no key, CORS-friendly, works in India
async function searchItunes(query, limit) {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}&entity=song&country=in`
  );
  if (!response.ok) throw new Error("iTunes search failed");
  const data = await response.json();
  return (data.results || [])
    .filter(t => t.previewUrl)
    .map(t => ({
      id:      t.trackId,
      title:   t.trackName,
      artist:  { name: t.artistName },
      album:   { cover_xl: t.artworkUrl100?.replace("100x100", "600x600") },
      preview: t.previewUrl,
    }));
}

// Fetch all queries in parallel, merge + deduplicate + shuffle for genuine variety
export async function getRecommendations(queries, limit = 30) {
  const perQuery = Math.max(8, Math.ceil(limit / queries.length));

  const results = await Promise.allSettled(
    queries.map(q => searchItunes(q, perQuery))
  );

  // Flatten successful results, deduplicate by track id
  const seen = new Set();
  const unique = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value)
    .filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });

  // Fisher-Yates shuffle so every call returns a different order
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }

  return unique.slice(0, limit);
}
