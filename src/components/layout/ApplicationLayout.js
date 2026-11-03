import { Suspense } from "react";
import styles from "./ApplicationLayout.module.css";
import ApplicationNavigation from "../navigation/ApplicationNavigation";

export default function ApplicationLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Suspense fallback={null}>
        <ApplicationNavigation />
      </Suspense>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
