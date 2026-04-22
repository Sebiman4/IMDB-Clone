/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Cards from "../../components/card/card";
import { tmdbGet } from "../../services/tmdb";
import "./search.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Search = () => {
  const query = useQuery();
  const q = (query.get("q") || "").trim();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) {
      setResults([]);
      setError("");
      return;
    }

    let isCancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await tmdbGet("/search/movie", { query: q, include_adult: false });
        if (!isCancelled) setResults(data?.results || []);
      } catch (e) {
        if (!isCancelled) {
          setResults([]);
          setError(e?.message || "Gagal melakukan pencarian.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [q]);

  return (
    <div className="searchPage">
      <div className="searchPage__header">
        <h2 className="searchPage__title">{q ? `Hasil pencarian: ${q}` : "Cari film"}</h2>
        {isLoading && <div className="searchPage__status">Loading...</div>}
        {!isLoading && error && <div className="searchPage__status searchPage__status--error">{error}</div>}
        {!isLoading && !error && q && (
          <div className="searchPage__status">{results.length} hasil ditemukan</div>
        )}
      </div>

      <div className="searchPage__grid">
        {results.map((movie) => (
          <Cards key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Search;

