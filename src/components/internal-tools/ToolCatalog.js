import Link from "next/link";
import { internalTools } from "../../data/internalTools";
import styles from "./ToolCatalog.module.css";

export default function ToolCatalog() {
  return (
    <div className={styles.catalog}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Made for the work of building</p>
        <h1>Useful tools, <em>right here.</em></h1>
        <p>Small, practical utilities to help move the work along. No setup required.</p>
      </header>

      <div className={styles.catalogMeta}>
        <h2>Tool library</h2>
        <span>{internalTools.length} tools</span>
      </div>

      <div className={styles.grid}>
        {internalTools.map((tool) => {
          const ready = tool.status === "Ready to use";

          return (
            <Link className={styles.card} href={`/our-tools/${tool.slug}`} key={tool.slug}>
              <div className={styles.cardTop}>
                <span className={styles.mark} aria-hidden="true">{tool.initials}</span>
                <span className={`${styles.status} ${ready ? styles.ready : ""}`}>
                  <span /> {tool.status}
                </span>
              </div>
              <p className={styles.category}>{tool.category}</p>
              <h3>{tool.name}</h3>
              <p className={styles.description}>{tool.description}</p>
              <span className={styles.cardAction}>
                {ready ? "Open tool" : "View interface"}
                <span aria-hidden="true">↗</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
