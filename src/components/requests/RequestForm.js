"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useRequests } from "../providers/RequestsProvider";
import styles from "./RequestsPages.module.css";

export default function RequestForm() {
  const router = useRouter();
  const { addRequest } = useRequests();
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [form, setForm] = useState({
    title: "",
    problem: "",
    category: "",
    referenceUrl: "",
    additionalDetails: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest("/categories")
      .then(({ data }) => { if (active) setCategories(data); })
      .catch((requestError) => { if (active) setCategoryError(requestError.message); });
    return () => { active = false; };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.problem.trim()) {
      setError("Add a tool name and describe the problem it solves to continue.");
      return;
    }

    setSubmitting(true);
    setError("");
    const additionalContext = [
      form.additionalDetails.trim(),
      form.referenceUrl.trim() ? `Reference URL: ${form.referenceUrl.trim()}` : "",
    ].filter(Boolean).join("\n\n");
    if (additionalContext.length > 2000) {
      setError("Additional details and the reference URL must fit within 2,000 characters together.");
      return;
    }
    try {
      const request = await addRequest({
        title: form.title.trim(),
        description: form.problem.trim(),
        ...(additionalContext ? { useCase: additionalContext } : {}),
        ...(form.category ? { categoryId: form.category } : {}),
      });
      router.push(`/requests/${request.id}?submitted=1`);
    } catch (requestError) {
      setError(requestError.message);
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.formShell}>
      <header className={styles.formHeader}>
        <Link className={styles.backLink} href="/requests"><span aria-hidden="true">←</span> My Requests</Link>
        <p className={styles.eyebrow}>Help shape the toolkit</p>
        <h1>Request a <em>tool.</em></h1>
        <p>Tell us what you need and what it would help you do. We’ll keep your request here so you can follow along.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Tool name or description <b aria-hidden="true">*</b></span>
          <input
            autoComplete="off"
            maxLength={120}
            name="title"
            onChange={updateField}
            placeholder="e.g. A simple way to follow up on unpaid invoices"
            required
            value={form.title}
          />
        </label>

        <label className={styles.field}>
          <span>What problem would it solve? <b aria-hidden="true">*</b></span>
          <textarea
            maxLength={1200}
            name="problem"
            onChange={updateField}
            placeholder="Tell us about the task, what makes it difficult today, and who it affects."
            required
            rows={4}
            value={form.problem}
          />
        </label>

        <label className={styles.field}>
          <span>Category <small>Optional</small></span>
          <select name="category" onChange={updateField} value={form.category}>
            <option value="">Choose a category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        {categoryError && <p className={styles.formError} role="status">Categories could not be loaded. You can still submit without one.</p>}

        <label className={styles.field}>
          <span>Reference URL <small>Optional</small></span>
          <input
            autoComplete="url"
            name="referenceUrl"
            onChange={updateField}
            placeholder="https://example.com"
            type="url"
            value={form.referenceUrl}
          />
        </label>

        <label className={styles.field}>
          <span>Additional details <small>Optional</small></span>
          <textarea
            maxLength={2000}
            name="additionalDetails"
            onChange={updateField}
            placeholder="Anything else we should know?"
            rows={3}
            value={form.additionalDetails}
          />
        </label>

        {error && <p className={styles.formError} role="alert">{error}</p>}

        <div className={styles.formFooter}>
          <p>Your request will be sent to Toolspace and tracked in this browser.</p>
          <button className={styles.primaryLink} disabled={submitting} type="submit">{submitting ? "Submitting…" : "Submit request"} <span aria-hidden="true">↗</span></button>
        </div>
      </form>
    </div>
  );
}
