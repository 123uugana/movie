"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchValue(pathname === "/search" ? searchParams.get("query") || "" : "");
  }, [pathname, searchParams]);

  useEffect(() => {
    const query = searchValue.trim();

    if (query.length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timerId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search-suggestions?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        setSuggestions(data.suggestions || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSuggestions([]);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timerId);
    };
  }, [searchValue]);

  function submitSearch(event) {
    event.preventDefault();
    goToSearch(searchValue);
  }

  function goToSearch(value) {
    const query = value.trim();

    router.push(query ? `/search?query=${encodeURIComponent(query)}` : "/search");
    setIsFocused(false);
  }

  return (
    <div className="header-search-wrap">
      <form className="header-search" onSubmit={submitSearch}>
        <span>⌕</span>
        <input
          aria-label="Search movies"
          autoComplete="off"
          className="header-search-text"
          onBlur={() => window.setTimeout(() => setIsFocused(false), 140)}
          onChange={(event) => setSearchValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search..."
          value={searchValue}
        />
      </form>

      {isFocused && suggestions.length > 0 ? (
        <div className="search-suggestions">
          {suggestions.map((movie) => (
            <button
              key={movie.id}
              onMouseDown={(event) => {
                event.preventDefault();
                setSearchValue(movie.title);
                goToSearch(movie.title);
              }}
              type="button"
            >
              <span>{movie.title}</span>
              <small>{movie.year}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
