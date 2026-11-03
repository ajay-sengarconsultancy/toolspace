"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchSuggestions } from "../../data/homepage";
import styles from "./HomeSearch.module.css";

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return searchSuggestions.slice(0, 3);

    return searchSuggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(normalizedQuery))
      .slice(0, 3);
  }, [query]);

  function navigateToSearch(searchQuery) {
    const selectedQuery = searchQuery.trim();
    if (!selectedQuery) return;

    setQuery(selectedQuery);
    setFocused(false);
    router.push(`/discover?q=${encodeURIComponent(selectedQuery)}`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    navigateToSearch(query);
  }

  return (
    <div className={styles.searchWrap}>
      <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
        <span className={styles.searchIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.3 4.3" />
          </svg>
        </span>
        <input
          aria-label="Search for tools"
          aria-autocomplete="list"
          aria-controls="home-search-suggestions"
          aria-expanded={focused && suggestions.length > 0}
          autoComplete="off"
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setFocused(false);
          }}
          placeholder="What are you looking for?"
          value={query}
        />
        <button className={styles.searchButton} type="submit">
          Search
          <span aria-hidden="true">↗</span>
        </button>
      </form>

      {focused && suggestions.length > 0 && (
        <div className={styles.suggestions} id="home-search-suggestions" role="listbox" aria-label="Search suggestions">
          <p className={styles.suggestionLabel}>Suggested searches</p>
          {suggestions.map((suggestion) => (
            <button
              className={styles.suggestion}
              key={suggestion}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => navigateToSearch(suggestion)}
              role="option"
              type="button"
            >
              <span>{suggestion}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
