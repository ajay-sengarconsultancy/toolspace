"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, categoryLabel, formatEta, formatRequestStatus } from "../../lib/api";
import RequestStatusTracker from "./RequestStatusTracker";
import styles from "./RequestsPages.module.css";

function formatDate(dateString) {
  const date = dateString?.slice(0, 10);
  if (!date) return "Date unavailable";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function statusClass(status) {
  return styles[`status${status.replaceAll(" ", "")}`] ?? "";
}

export default function RequestDetailsPage({ id, submitted = false }) {
  const [result, setResult] = useState({ id: "", request: null, error: null });

  useEffect(() => {
    let active = true;
    apiRequest(`/requests/${encodeURIComponent(id)}`)
      .then(({ data }) => { if (active) setResult({ id, request: data, error: null }); })
      .catch((error) => { if (active) setResult({ id, request: null, error }); });
    return () => { active = false; };
  }, [id]);

  const loading = result.id !== id;
  const request = result.id === id ? result.request : null;
  const error = result.id === id ? result.error : null;
  if (loading) return <p className={styles.loading} role="status">Loading request…</p>;
  if (error || !request) {
    const notFound = error?.status === 404;
    return (
      <div className={styles.notFound} role={notFound ? undefined : "alert"}>
        <p className={styles.eyebrow}>{notFound ? "Request not found" : "Unable to load request"}</p>
        <h1>{notFound ? "This request could not be found." : error?.message}</h1>
        <Link className={styles.primaryLink} href="/requests">Go to My Requests <span aria-hidden="true">↗</span></Link>
      </div>
    );
  }

  const status = formatRequestStatus(request.status);
  const useCase = request.useCase || "";
  const referenceUrl = useCase.match(/Reference URL: (https?:\/\/\S+)/)?.[1];
  const additionalDetails = useCase.replace(/\n*Reference URL: https?:\/\/\S+/g, "").trim();

  return (
    <div className={styles.detail}>
      <Link className={styles.backLink} href="/requests"><span aria-hidden="true">←</span> My Requests</Link>
      {submitted && <p className={styles.formSuccess} role="status">Your request was submitted successfully.</p>}
      <header className={styles.detailTop}>
        <div>
          <p className={styles.eyebrow}>{categoryLabel(request.category)}</p>
          <h1>{request.title}</h1>
          <p className={styles.detailDate}>Requested {formatDate(request.createdAt)}</p>
        </div>
        <span className={`${styles.status} ${statusClass(status)}`}>{status}</span>
      </header>

      {request.status === "SCHEDULED" && request.eta && (
        <div className={styles.etaPanel}><span aria-hidden="true">◷</span><span>Expected availability: <strong>{formatEta(request.eta)}</strong></span></div>
      )}

      <RequestStatusTracker status={status} />

      <div className={styles.detailGrid}>
        <div>
          <section className={styles.detailSection}><h2>Problem to solve</h2><p>{request.description}</p></section>
          {additionalDetails && <section className={styles.detailSection}><h2>Additional details</h2><p>{additionalDetails}</p></section>}
          {referenceUrl && <section className={styles.detailSection}><h2>Reference</h2><a className={styles.referenceLink} href={referenceUrl} rel="noreferrer" target="_blank">{referenceUrl} <span aria-hidden="true">↗</span></a></section>}
        </div>
      </div>
    </div>
  );
}
