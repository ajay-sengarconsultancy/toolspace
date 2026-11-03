import Link from "next/link";
import styles from "./ToolCard.module.css";

export default function ToolCard({ tool, alternative = false }) {
  return (
    <Link aria-label={`View ${tool.name}`} className={styles.card} href={`/discover/${tool.slug}`}>
      <div className={styles.cardTop}>
        <span
          className={styles.mark}
          style={{ color: tool.markColor, backgroundColor: tool.markBackground }}
          aria-hidden="true"
        >
          {tool.initials}
        </span>
        <span className={styles.pricing}>{tool.pricing}</span>
      </div>
      <p className={styles.category}>{tool.category}</p>
      <h3>{tool.name}</h3>
      <p className={styles.description}>{tool.description}</p>
      <div className={styles.cardFooter}>
        {alternative ? (
          <span className={styles.alternativeLabel}>Alternative to {tool.alternativeFor}</span>
        ) : (
          <span className={styles.tagList}>{tool.tags?.slice(0, 2).join(" · ") || "View tool details"}</span>
        )}
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
