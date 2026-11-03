"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiRequest, categoryLabel } from "../../lib/api";
import styles from "./ToolDetailPage.module.css";

export default function ToolDetailPage({ slug }) {
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(`/tools/${encodeURIComponent(slug)}`)
      .then(({ data }) => { if (active) setTool(data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <p className={styles.message} role="status">Loading tool…</p>;
  if (error) {
    return (
      <div className={styles.notFound} role="alert">
        <p className={styles.eyebrow}>{error}</p>
        <h1>We couldn’t load this tool.</h1>
        <Link href="/discover">Back to Discover <span aria-hidden="true">↗</span></Link>
      </div>
    );
  }
  if (!tool) return null;

  const pricing = { FREE: "Free", FREEMIUM: "Free and paid plans", PAID: "Paid plans" }[tool.pricingType] ?? tool.pricingType;
  return (
    <article className={styles.detail}>
      <Link className={styles.backLink} href="/discover">← All tools</Link>
      <header className={styles.header}>
        {tool.logoUrl ? <Image className={styles.logo} src={tool.logoUrl} alt="" width={52} height={52} unoptimized /> : <span className={styles.mark} aria-hidden="true">{tool.name.slice(0, 1)}</span>}
        <div>
          <p className={styles.eyebrow}>{categoryLabel(tool.category)}</p>
          <h1>{tool.name}</h1>
        </div>
      </header>
      <p className={styles.description}>{tool.description}</p>
      <p className={styles.pricing}>{pricing}</p>
      <a className={styles.visitButton} href={tool.websiteUrl} rel="noreferrer" target="_blank">Visit website <span aria-hidden="true">↗</span></a>
    </article>
  );
}
