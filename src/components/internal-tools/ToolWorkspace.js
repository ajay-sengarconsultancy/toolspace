import Link from "next/link";
import JsonFormatter from "./JsonFormatter";
import InvoiceGenerator from "./InvoiceGenerator";
import PrototypeTool from "./PrototypeTool";
import styles from "./ToolWorkspace.module.css";

export default function ToolWorkspace({ tool }) {
  const ready = tool.status === "Ready to use";
  let workspace;

  if (tool.slug === "json-formatter") {
    workspace = <JsonFormatter />;
  } else if (tool.slug === "invoice-generator") {
    workspace = <InvoiceGenerator />;
  } else {
    workspace = <PrototypeTool tool={tool} />;
  }

  return (
    <div className={styles.workspace}>
      <Link className={styles.backLink} href="/our-tools">
        <span aria-hidden="true">←</span> All tools
      </Link>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{tool.category} · Our tools</p>
          <h1>{tool.name}</h1>
          <p>{tool.summary}</p>
        </div>
        <span className={`${styles.status} ${ready ? styles.ready : ""}`}>
          <span /> {tool.status}
        </span>
      </header>
      {workspace}
    </div>
  );
}
