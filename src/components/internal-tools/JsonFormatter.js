"use client";

import { useState } from "react";
import styles from "./JsonFormatter.module.css";

const sampleJson = '{\n  "project": "New venture",\n  "stage": "prototype",\n  "team": ["founder", "designer"],\n  "active": true\n}';

export default function JsonFormatter() {
  const [source, setSource] = useState(sampleJson);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  function processJson(mode) {
    try {
      const parsed = JSON.parse(source);

      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
        setMessage("JSON formatted successfully.");
      } else if (mode === "minify") {
        setOutput(JSON.stringify(parsed));
        setMessage("JSON minified successfully.");
      } else {
        setOutput(JSON.stringify(parsed, null, 2));
        setMessage("Valid JSON. Your data is well formed.");
      }

      setMessageType("success");
    } catch (error) {
      setOutput("");
      setMessage(error instanceof Error ? error.message : "This JSON could not be parsed.");
      setMessageType("error");
    }
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setMessage("Output copied to clipboard.");
      setMessageType("success");
    } catch {
      setMessage("Clipboard access is unavailable. Select and copy the output instead.");
      setMessageType("error");
    }
  }

  function clearAll() {
    setSource("");
    setOutput("");
    setMessage("");
  }

  return (
    <section className={styles.formatter} aria-label="JSON formatting workspace">
      <div className={styles.toolbar}>
        <p>Paste or type JSON to format it in your browser.</p>
        <button className={styles.clearButton} onClick={clearAll} type="button">Clear</button>
      </div>

      <div className={styles.editorGrid}>
        <label className={styles.editorPanel}>
          <span className={styles.panelHeading}>Input <span>JSON</span></span>
          <textarea
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="JSON input"
            onChange={(event) => {
              setSource(event.target.value);
              setOutput("");
              setMessage("");
            }}
            spellCheck="false"
            value={source}
          />
        </label>
        <div className={styles.editorPanel}>
          <div className={styles.panelHeading}>
            <span>Output <span>JSON</span></span>
            <button disabled={!output} onClick={copyOutput} type="button">Copy</button>
          </div>
          <textarea aria-label="Formatted JSON output" readOnly value={output} placeholder="Your result will appear here" />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={() => processJson("format")} type="button">Format JSON</button>
        <button className={styles.secondaryButton} onClick={() => processJson("minify")} type="button">Minify</button>
        <button className={styles.secondaryButton} onClick={() => processJson("validate")} type="button">Validate</button>
        <span className={`${styles.message} ${messageType === "error" ? styles.error : ""}`} role="status" aria-live="polite">
          {message}
        </span>
      </div>
      <p className={styles.privacyNote}>Your JSON is processed locally in this browser and is not uploaded.</p>
    </section>
  );
}
