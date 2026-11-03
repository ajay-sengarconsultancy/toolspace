import { requestStatuses } from "../../data/requests";
import styles from "./RequestStatusTracker.module.css";

export default function RequestStatusTracker({ status }) {
  const currentIndex = requestStatuses.indexOf(status);
  const progress = currentIndex > 0 ? (currentIndex / (requestStatuses.length - 1)) * 100 : 0;

  return (
    <section
      className={styles.tracker}
      aria-label={`Request status: ${status}`}
      style={{ "--tracker-progress": `${progress}%` }}
    >
      <div className={styles.trackerHeading}>
        <h2>Request progress</h2>
        <p>Current stage <strong>{status}</strong></p>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.trackFill} />
      </div>
      <ol className={styles.steps}>
        {requestStatuses.map((step, index) => {
          const current = index === currentIndex;
          const complete = currentIndex > index;

          return (
            <li
              className={`${styles.step} ${current ? styles.current : ""} ${complete ? styles.complete : ""}`}
              key={step}
              aria-current={current ? "step" : undefined}
            >
              <span className={styles.stepDot} aria-hidden="true">{complete ? "✓" : ""}</span>
              <span className={styles.stepName}>{step}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
