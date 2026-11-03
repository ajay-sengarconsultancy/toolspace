"use client";

import { useMemo, useState } from "react";
import styles from "./InvoiceGenerator.module.css";

const currencies = ["USD", "EUR", "GBP", "INR"];

function formatAmount(amount, currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function numberFrom(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
}

export default function InvoiceGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("0");
  const [items, setItems] = useState([
    { id: "item-1", description: "Product strategy", quantity: "1", rate: "800" },
    { id: "item-2", description: "Design workshop", quantity: "2", rate: "150" },
  ]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + numberFrom(item.quantity) * numberFrom(item.rate), 0),
    [items],
  );
  const tax = subtotal * (numberFrom(taxRate) / 100);
  const total = subtotal + tax;

  function updateItem(id, key, value) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }

  function addItem() {
    setItems((current) => [
      ...current,
      { id: `item-${Date.now()}`, description: "", quantity: "1", rate: "0" },
    ]);
  }

  function removeItem(id) {
    setItems((current) => current.length > 1 ? current.filter((item) => item.id !== id) : current);
  }

  return (
    <div className={styles.invoiceWorkspace}>
      <div className={styles.invoiceToolbar}>
        <p>Fill in the details to build your invoice preview. Your work stays in this browser.</p>
        <button className={styles.printButton} onClick={() => window.print()} type="button">
          Print invoice <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className={styles.columns}>
        <section className={styles.editor} aria-labelledby="invoice-details-heading">
          <div className={styles.editorHeading}>
            <p className={styles.eyebrow}>Invoice details</p>
            <h2 id="invoice-details-heading">Your information</h2>
          </div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Your business</span>
              <input onChange={(event) => setBusinessName(event.target.value)} placeholder="Studio or company name" value={businessName} />
            </label>
            <label className={styles.field}>
              <span>Bill to</span>
              <input onChange={(event) => setClientName(event.target.value)} placeholder="Client or company name" value={clientName} />
            </label>
            <label className={styles.field}>
              <span>Invoice number</span>
              <input onChange={(event) => setInvoiceNumber(event.target.value)} value={invoiceNumber} />
            </label>
            <label className={styles.field}>
              <span>Currency</span>
              <select onChange={(event) => setCurrency(event.target.value)} value={currency}>
                {currencies.map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            </label>
            <label className={styles.field}>
              <span>Invoice date</span>
              <input onChange={(event) => setInvoiceDate(event.target.value)} type="date" value={invoiceDate} />
            </label>
            <label className={styles.field}>
              <span>Due date</span>
              <input onChange={(event) => setDueDate(event.target.value)} type="date" value={dueDate} />
            </label>
          </div>

          <div className={styles.itemsHeading}>
            <h3>Line items</h3>
            <button onClick={addItem} type="button">+ Add item</button>
          </div>
          <div className={styles.lineItems}>
            <div className={styles.tableHead}>
              <span>Description</span><span>Qty</span><span>Rate</span><span />
            </div>
            {items.map((item) => (
              <div className={styles.itemRow} key={item.id}>
                <input aria-label="Item description" onChange={(event) => updateItem(item.id, "description", event.target.value)} placeholder="Service or product" value={item.description} />
                <input aria-label="Quantity" min="0" onChange={(event) => updateItem(item.id, "quantity", event.target.value)} step="any" type="number" value={item.quantity} />
                <input aria-label="Rate" min="0" onChange={(event) => updateItem(item.id, "rate", event.target.value)} step="0.01" type="number" value={item.rate} />
                <button aria-label={`Remove ${item.description || "line item"}`} disabled={items.length === 1} onClick={() => removeItem(item.id)} type="button">×</button>
              </div>
            ))}
          </div>

          <label className={`${styles.field} ${styles.taxField}`}>
            <span>Tax rate (%)</span>
            <input min="0" onChange={(event) => setTaxRate(event.target.value)} step="0.01" type="number" value={taxRate} />
          </label>
          <p className={styles.localNote}>This tool creates a printable preview only. It does not send invoices or store your data.</p>
        </section>

        <section className={`${styles.preview} invoice-preview-container`} aria-label="Invoice preview">
          <div className={styles.previewLabel}>LIVE PREVIEW</div>
          <article className={styles.invoicePaper}>
            <div className={styles.invoiceTop}>
              <div>
                <p className={styles.invoiceEyebrow}>INVOICE</p>
                <h2>{businessName || "Your business"}</h2>
              </div>
              <p className={styles.invoiceNumber}>{invoiceNumber || "INV-001"}</p>
            </div>

            <div className={styles.invoiceParties}>
              <div><span>PREPARED FOR</span><strong>{clientName || "Client name"}</strong></div>
              <div><span>DATE</span><strong>{invoiceDate || "—"}</strong></div>
              <div><span>DUE DATE</span><strong>{dueDate || "—"}</strong></div>
            </div>

            <div className={styles.previewTable}>
              <div className={styles.previewTableHead}><span>DESCRIPTION</span><span>AMOUNT</span></div>
              {items.map((item) => (
                <div className={styles.previewItem} key={item.id}>
                  <span>{item.description || "Item description"}<small>{numberFrom(item.quantity)} × {formatAmount(numberFrom(item.rate), currency)}</small></span>
                  <strong>{formatAmount(numberFrom(item.quantity) * numberFrom(item.rate), currency)}</strong>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div><span>Subtotal</span><strong>{formatAmount(subtotal, currency)}</strong></div>
              <div><span>Tax ({numberFrom(taxRate)}%)</span><strong>{formatAmount(tax, currency)}</strong></div>
              <div className={styles.totalRow}><span>Total due</span><strong>{formatAmount(total, currency)}</strong></div>
            </div>
            <p className={styles.thankYou}>Thank you for your business.</p>
          </article>
        </section>
      </div>
    </div>
  );
}
