"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, categoryLabel, formatRequestStatus } from "../../lib/api";
import styles from "../../app/page.module.css";

export function FeaturedTools() {
  const [tools, setTools] = useState([]);
  const [message, setMessage] = useState("Loading featured tools…");

  useEffect(() => {
    let active = true;
    apiRequest("/tools", { query: { page: 1, limit: 3 } })
      .then(({ data }) => { if (active) { setTools(data); setMessage(data.length ? "" : "No tools are available yet."); } })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  if (!tools.length) return <p className={styles.homeApiMessage} role="status">{message}</p>;
  return (
    <div className={styles.toolGrid}>
      {tools.map((tool) => (
        <Link className={styles.toolCard} href={`/discover/${tool.slug}`} key={tool.id}>
          <div className={styles.toolCardTop}>
            <span className={styles.toolMark} style={{ color: "#1F5132", backgroundColor: "#e9f0e8" }} aria-hidden="true">{tool.name.slice(0, 1)}</span>
            <span className={styles.toolCategory}>{categoryLabel(tool.category)}</span>
          </div>
          <h3>{tool.name}</h3>
          <p className={styles.toolDescription}>{tool.description}</p>
          <span className={styles.availability}><span className={styles.externalDot} />{({ FREE: "Free", FREEMIUM: "Free and paid plans", PAID: "Paid plans" })[tool.pricingType] ?? "Explore tool"}</span>
        </Link>
      ))}
    </div>
  );
}

export function RoadmapPreview() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("Loading roadmap…");

  useEffect(() => {
    let active = true;
    apiRequest("/roadmap", { query: { sort: "popular", page: 1, limit: 3 } })
      .then(({ data }) => { if (active) { setRequests(data); setMessage(data.length ? "" : "No requests have been added yet."); } })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  if (!requests.length) return <p className={styles.homeApiMessage} role="status">{message}</p>;
  return (
    <div className={styles.roadmapList}>
      {requests.map((request, index) => (
        <Link className={styles.roadmapItem} href={`/requests/${request.id}`} key={request.id}>
          <span className={styles.roadmapIndex}>0{index + 1}</span>
          <span className={styles.roadmapName}>{request.title}</span>
          <span className={styles.status}>{formatRequestStatus(request.status)}</span>
        </Link>
      ))}
    </div>
  );
}
