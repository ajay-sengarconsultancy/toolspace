"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { roadmapGroups } from "../../data/requests";
import { apiRequest, categoryLabel, formatEta, formatRequestStatus } from "../../lib/api";
import { useRequests } from "../providers/RequestsProvider";
import styles from "./RoadmapPage.module.css";

function statusClass(status) {
  return styles[`status${status.replaceAll(" ", "")}`] ?? "";
}

export default function RoadmapPage() {
  const { voterKey } = useRequests();
  const [requests, setRequests] = useState([]);
  const [voteStates, setVoteStates] = useState({});
  const [readyVotes, setReadyVotes] = useState({});
  const [busyVotes, setBusyVotes] = useState({});
  const [voteErrors, setVoteErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const requestIdKey = requests.map((request) => request.id).join("|");

  useEffect(() => {
    let active = true;
    apiRequest("/roadmap", { query: { sort: "popular", page, limit: 12 } })
      .then(({ data, meta: nextMeta }) => {
        if (!active) return;
        setRequests(data);
        setMeta(nextMeta);
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  useEffect(() => {
    if (!voterKey || !requestIdKey) return;
    let active = true;
    Promise.all(requestIdKey.split("|").map(async (requestId) => {
      try {
        const { data } = await apiRequest(`/requests/${encodeURIComponent(requestId)}/votes/me`, { query: { voterKey } });
        return [requestId, data, null];
      } catch (requestError) {
        return [requestId, null, requestError];
      }
    })).then((results) => {
      if (!active) return;
      const nextStates = {};
      const nextReady = {};
      let failed = false;
      const voteCounts = {};
      results.forEach(([id, value]) => {
        nextStates[id] = Boolean(value?.hasVoted);
        nextReady[id] = true;
        if (value) voteCounts[id] = value.voteCount;
        failed ||= !value;
      });
      setVoteStates(nextStates);
      setReadyVotes(nextReady);
      setRequests((current) => current.map((request) => voteCounts[request.id] === undefined ? request : { ...request, voteCount: voteCounts[request.id] }));
      if (failed) setVoteErrors((current) => ({ ...current, global: "Some vote statuses could not be loaded. You can still try voting; the API will prevent duplicates." }));
    });
    return () => { active = false; };
  }, [requestIdKey, voterKey]);

  async function toggleVote(request) {
    if (!voterKey) return;
    const alreadyVoted = Boolean(voteStates[request.id]);
    setBusyVotes((current) => ({ ...current, [request.id]: true }));
    setVoteErrors((current) => ({ ...current, [request.id]: "" }));
    try {
      const result = alreadyVoted
        ? await apiRequest(`/requests/${encodeURIComponent(request.id)}/votes`, { method: "DELETE", body: { voterKey } })
        : await apiRequest(`/requests/${encodeURIComponent(request.id)}/votes`, { method: "POST", body: { voterKey } });
      setRequests((current) => current.map((item) => item.id === request.id ? { ...item, voteCount: result.data.voteCount } : item));
      setVoteStates((current) => ({ ...current, [request.id]: !alreadyVoted }));
      setReadyVotes((current) => ({ ...current, [request.id]: true }));
    } catch (requestError) {
      setVoteErrors((current) => ({
        ...current,
        [request.id]: requestError.status === 409 ? "You’ve already voted for this request, or voting has closed." : requestError.message,
      }));
      if (requestError.status === 409) {
        try {
          const { data } = await apiRequest(`/requests/${encodeURIComponent(request.id)}/votes/me`, { query: { voterKey } });
          setVoteStates((current) => ({ ...current, [request.id]: data.hasVoted }));
          setRequests((current) => current.map((item) => item.id === request.id ? { ...item, voteCount: data.voteCount } : item));
        } catch { /* Keep the existing card count and show the vote error. */ }
      }
    } finally {
      setBusyVotes((current) => ({ ...current, [request.id]: false }));
    }
  }

  const populatedGroups = roadmapGroups
    .map((group) => ({
      ...group,
      requests: requests
        .filter((request) => formatRequestStatus(request.status) === group.status)
        .sort((first, second) => (Number(second.voteCount) || 0) - (Number(first.voteCount) || 0)),
    }))
    .filter((group) => group.requests.length > 0);

  return (
    <div className={styles.roadmap}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>A community-shaped toolkit</p><h1>Ideas in <em>motion.</em></h1><p>See what founders are asking for, what we’re exploring, and what’s taking shape.</p></div>
        <Link className={styles.requestButton} href="/requests/new">Request a Tool <span aria-hidden="true">↗</span></Link>
      </header>

      <div className={styles.roadmapIntro}>
        <div><h2>The public roadmap</h2><p>Vote for the ideas that would help your work. Your vote is tied to this browser.</p></div>
        <Link className={styles.myRequestsLink} href="/requests">My Requests <span aria-hidden="true">↗</span></Link>
      </div>

      {voteErrors.global && <p className={styles.apiMessage} role="status">{voteErrors.global}</p>}
      {loading ? <p className={styles.apiMessage} role="status">Loading roadmap…</p> : null}
      {error ? <p className={styles.apiMessage} role="alert">{error} <button className={styles.retryButton} onClick={() => window.location.reload()} type="button">Retry</button></p> : null}

      {!loading && !error && populatedGroups.length ? (
        <div className={styles.groups}>
          {populatedGroups.map((group, index) => (
            <section className={styles.group} key={group.status} aria-labelledby={`group-${index}`}>
              <div className={styles.groupHeading}>
                <div className={styles.stageIndex}>{String(index + 1).padStart(2, "0")}</div>
                <div><div className={styles.groupTitleRow}><h2 id={`group-${index}`}>{group.status}</h2><span className={`${styles.status} ${statusClass(group.status)}`}>{group.status}</span></div><p>{group.description}</p></div>
                <span className={styles.groupCount}>{group.requests.length.toString().padStart(2, "0")}</span>
              </div>

              <div className={styles.requestGrid}>
                {group.requests.map((request) => {
                  const hasVoted = Boolean(voteStates[request.id]);
                  const available = request.status === "AVAILABLE";
                  return (
                    <article className={styles.requestCard} key={request.id}>
                      <div className={styles.cardMain}>
                        <div className={styles.cardMeta}><p className={styles.category}>{categoryLabel(request.category)}</p><span className={`${styles.status} ${statusClass(group.status)}`}>{group.status}</span></div>
                        <h3>{request.title}</h3><p className={styles.description}>{request.description}</p>
                        {request.status === "SCHEDULED" && request.eta && <p className={styles.eta}>Expected availability <strong>{formatEta(request.eta)}</strong></p>}
                      </div>
                      <footer className={styles.cardFooter}>
                        <button
                          aria-label={hasVoted ? `Remove your vote for ${request.title}` : `Upvote ${request.title}`}
                          aria-pressed={hasVoted}
                          className={`${styles.voteButton} ${hasVoted ? styles.voteButtonActive : ""}`}
                          disabled={!readyVotes[request.id] || busyVotes[request.id] || (available && !hasVoted)}
                          onClick={() => toggleVote(request)}
                          type="button"
                        >
                          <span aria-hidden="true">↑</span><span>{Number(request.voteCount) || 0}</span><span className={styles.voteWord}>{available && !hasVoted ? "closed" : busyVotes[request.id] ? "saving…" : "votes"}</span>
                        </button>
                        <Link className={styles.detailsLink} href={`/requests/${request.id}`}>Details <span aria-hidden="true">↗</span></Link>
                      </footer>
                      {voteErrors[request.id] && <p className={styles.voteError} role="alert">{voteErrors[request.id]}</p>}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {!loading && !error && populatedGroups.length === 0 && (
        <div className={styles.emptyState}><p className={styles.eyebrow}>Nothing on the roadmap yet</p><h2>Start with an idea.</h2><p>Share a problem you’d like a tool to solve. It’ll appear here for the community to follow.</p><Link className={styles.requestButton} href="/requests/new">Request a Tool <span aria-hidden="true">↗</span></Link></div>
      )}

      {!loading && !error && meta.totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Roadmap pages">
          <button className={styles.retryButton} disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} type="button">Previous</button>
          <span>Page {meta.page} of {meta.totalPages}</span>
          <button className={styles.retryButton} disabled={page >= meta.totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} type="button">Next</button>
        </nav>
      )}
    </div>
  );
}
