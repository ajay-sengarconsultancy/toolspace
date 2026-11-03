"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, formatEta, formatRequestStatus, categoryLabel } from "../../lib/api";
import styles from "./RequestsPages.module.css";

function formatDate(dateString) {
  const date = dateString?.slice(0, 10);
  if (!date) return "Date unavailable";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function statusClass(status) {
  return styles[`status${status.replaceAll(" ", "")}`] ?? "";
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => {
        const savedIds = JSON.parse(window.localStorage.getItem("toolspace-owned-requests-v1") || "[]");
        if (!Array.isArray(savedIds) || savedIds.length === 0) return [];
        return apiRequest("/requests", { query: { page: 1, limit: 50 } })
          .then(({ data }) => data.filter((request) => savedIds.includes(request.id)));
      })
      .then((data) => { if (active) setRequests(data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const displayedRequests = requests;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Good tools start with good questions</p>
          <h1>My <em>Requests</em></h1>
          <p>Follow the tools you’ve asked us to bring to life.</p>
        </div>
        <div className={styles.headerActions}>
          <Link className={styles.publicRoadmapLink} href="/roadmap">Public roadmap <span aria-hidden="true">↗</span></Link>
          <Link className={styles.primaryLink} href="/requests/new">Request a Tool <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className={styles.listMeta}>
        <strong>Your requests</strong>
          <span>{loading ? "Loading…" : `${displayedRequests.length} ${displayedRequests.length === 1 ? "request" : "requests"}`}</span>
      </div>

      {error && <p className={styles.formError} role="alert">{error}</p>}
      {loading ? <p className={styles.loading} role="status">Loading your requests…</p> : displayedRequests.length ? (
        <div className={styles.requestList}>
          {displayedRequests.map((request) => (
            <Link className={styles.requestCard} href={`/requests/${request.id}`} key={request.id}>
              <div className={styles.requestCopy}>
                <p className={styles.requestCategory}>{categoryLabel(request.category)}</p>
                <h2>{request.title}</h2>
                <p className={styles.requestProblem}>{request.description}</p>
              </div>
              <div className={styles.requestMeta}>
                <span className={`${styles.status} ${statusClass(formatRequestStatus(request.status))}`}>{formatRequestStatus(request.status)}</span>
                <span className={styles.date}>Requested {formatDate(request.createdAt)}</span>
                {request.status === "SCHEDULED" && request.eta && (
                  <span className={styles.eta}>Expected {formatEta(request.eta)}</span>
                )}
              </div>
              <span className={styles.cardArrow} aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2>No requests yet</h2>
          <p>Tell us what would make the work a little easier. You can follow its progress here.</p>
          <Link className={styles.primaryLink} href="/requests/new">Request a Tool <span aria-hidden="true">↗</span></Link>
        </div>
      )}
    </div>
  );
}
