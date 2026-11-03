"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest, categoryLabel } from "../../lib/api";
import ToolCard from "./ToolCard";
import styles from "./DiscoveryPage.module.css";

const pricingOptions = [
  { label: "Free", value: "FREE" },
  { label: "Freemium", value: "FREEMIUM" },
  { label: "Paid", value: "PAID" },
];

function presentTool(tool) {
  const pricing = { FREE: "Free", FREEMIUM: "Free and paid plans", PAID: "Paid plans" }[tool.pricingType] ?? tool.pricingType;
  return {
    ...tool,
    category: categoryLabel(tool.category),
    priceType: tool.pricingType,
    pricing,
    initials: tool.name?.slice(0, 1).toUpperCase() || "T",
    markColor: "#1F5132",
    markBackground: "#e9f0e8",
    tags: [],
  };
}

export default function DiscoveryPage({ initialQuery = "", initialCategory = "", initialPricing = "", initialPage = 1 }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState(initialPricing);
  const [page, setPage] = useState(Number(initialPage) || 1);
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest("/categories")
      .then(({ data }) => { if (active) setCategories(data); })
      .catch((requestError) => { if (active) setCategoryError(requestError.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      apiRequest("/tools", {
        query: {
          search: query.trim() || undefined,
          category: category || undefined,
          pricing: price || undefined,
          page,
          limit: 12,
        },
      })
        .then(({ data, meta: nextMeta }) => {
          if (!active) return;
          setTools(data.map(presentTool));
          setMeta(nextMeta);
        })
        .catch((requestError) => { if (active) setError(requestError.message); })
        .finally(() => { if (active) setLoading(false); });
    }, query ? 250 : 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, category, price, page, refresh]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (price) params.set("pricing", price);
    if (page > 1) params.set("page", String(page));
    const suffix = params.toString();
    router.replace(`/discover${suffix ? `?${suffix}` : ""}`, { scroll: false });
  }, [query, category, price, page, router]);

  const alternatives = useMemo(() => tools.filter((tool) => tool.alternativeFor), [tools]);

  function changeQuery(value) {
    setQuery(value);
    setPage(1);
  }

  function resetFilters() {
    changeQuery("");
    setCategory("");
    setPrice("");
  }

  return (
    <div className={styles.discovery}>
      <section className={styles.intro} aria-labelledby="discovery-heading">
        <p className={styles.eyebrow}>The founder’s toolkit</p>
        <h1 id="discovery-heading">Find a tool that <em>fits.</em></h1>
        <p>Explore thoughtful options for the real work of building a business.</p>
      </section>

      <section className={styles.finder} aria-label="Search and filter tools">
        <label className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.3 4.3" /></svg></span>
          <input
            aria-label="Search tools"
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Search tools, categories, or needs"
            type="search"
            value={query}
          />
          {query && <button aria-label="Clear search" className={styles.clearSearch} onClick={() => changeQuery("")} type="button">×</button>}
        </label>

        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Category</span>
          <div className={styles.categoryFilters} aria-label="Filter by category" role="group">
            {[{ name: "All categories", slug: "" }, ...categories].map((item) => (
              <button
                aria-pressed={category === item.slug}
                className={`${styles.filterChip} ${category === item.slug ? styles.filterChipActive : ""}`}
                key={item.slug || "all"}
                onClick={() => { setCategory(item.slug); setPage(1); }}
                type="button"
              >{item.name}</button>
            ))}
          </div>
        </div>
        {categoryError && <p className={styles.apiMessage} role="status">Categories could not be loaded: {categoryError}</p>}

        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Price</span>
          <div className={styles.priceFilters} aria-label="Filter by price" role="group">
            {[{ label: "All", value: "" }, ...pricingOptions].map((item) => (
              <button
                aria-pressed={price === item.value}
                className={`${styles.priceChip} ${price === item.value ? styles.priceChipActive : ""}`}
                key={item.value || "all"}
                onClick={() => { setPrice(item.value); setPage(1); }}
                type="button"
              >{item.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.results} aria-labelledby="results-heading" aria-busy={loading}>
        <div className={styles.resultsHeading}>
          <div>
            <p className={styles.eyebrow}>A considered shortlist</p>
            <h2 id="results-heading">{query.trim() ? `Results for “${query.trim()}”` : "Tools to get you moving"}</h2>
          </div>
          <p className={styles.resultCount} aria-live="polite">{meta.total} {meta.total === 1 ? "tool" : "tools"}</p>
        </div>

        {loading ? <p className={styles.apiMessage} role="status">Loading tools…</p> : null}
        {error ? <div className={styles.apiMessage} role="alert"><p>{error}</p><button className={styles.resetButton} onClick={() => setRefresh((current) => current + 1)} type="button">Retry</button></div> : null}
        {!loading && !error && tools.length > 0 && <div className={styles.toolGrid}>{tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>}
        {!loading && !error && tools.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyMark} aria-hidden="true">↗</span>
            <h3>No tools match those filters yet.</h3>
            <p>Try a broader search or clear the filters to see the full collection.</p>
            <button className={styles.resetButton} onClick={resetFilters} type="button">Clear search and filters</button>
            <Link className={styles.requestLink} href="/requests/new">Can’t find what you need? Request a tool <span aria-hidden="true">↗</span></Link>
          </div>
        )}

        {!loading && !error && meta.totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Tool result pages">
            <button className={styles.pageButton} disabled={page <= 1} onClick={() => setPage((value) => value - 1)} type="button">Previous</button>
            <span>Page {meta.page} of {meta.totalPages}</span>
            <button className={styles.pageButton} disabled={page >= meta.totalPages} onClick={() => setPage((value) => value + 1)} type="button">Next</button>
          </nav>
        )}
      </section>

      {alternatives.length > 0 && (
        <section className={styles.alternatives} aria-labelledby="alternatives-heading">
          <div className={styles.alternativesHeading}><div><p className={styles.eyebrow}>Keep your options open</p><h2 id="alternatives-heading">Worth a second look</h2><p>Good alternatives can make the right choice clearer.</p></div></div>
          <div className={styles.alternativeGrid}>{alternatives.map((tool) => <ToolCard alternative key={tool.id} tool={tool} />)}</div>
        </section>
      )}
    </div>
  );
}
