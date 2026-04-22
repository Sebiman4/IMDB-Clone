const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const DEFAULT_LANGUAGE = "en-US";
const FALLBACK_API_KEY = "4e44d9029b1270a757cddc766a1bcb63";

function getApiKey() {
  const key = process.env.REACT_APP_TMDB_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : FALLBACK_API_KEY;
}

export function tmdbImageUrl(path, size = "original") {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export async function tmdbGet(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  const searchParams = new URLSearchParams();

  searchParams.set("api_key", getApiKey());
  searchParams.set("language", DEFAULT_LANGUAGE);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  url.search = searchParams.toString();

  const res = await fetch(url.toString());
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.status_message || `TMDB request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

