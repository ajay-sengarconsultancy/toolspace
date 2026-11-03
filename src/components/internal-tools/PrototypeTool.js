import styles from "./PrototypeTool.module.css";

function PreviewNotice() {
  return (
    <div className={styles.notice} role="note">
      <span aria-hidden="true">i</span>
      <p><strong>Interface preview.</strong> This tool does not process data or produce results yet.</p>
    </div>
  );
}

function WebsiteAuditPreview() {
  return (
    <div className={styles.mockPanel}>
      <div className={styles.mockHeader}><span>Website overview</span><span>Preview</span></div>
      <label className={styles.inputRow}><span>Website URL</span><input disabled placeholder="https://yourwebsite.com" /></label>
      <div className={styles.metrics}>
        {["Performance", "Accessibility", "SEO"].map((label) => <div key={label}><span>{label}</span><strong>—</strong></div>)}
      </div>
      <button className={styles.disabledButton} disabled type="button">Website checks are not connected</button>
    </div>
  );
}

function SeoAnalyzerPreview() {
  return (
    <div className={styles.mockPanel}>
      <div className={styles.mockHeader}><span>Page analysis</span><span>Preview</span></div>
      <label className={styles.inputRow}><span>Page URL</span><input disabled placeholder="https://yourwebsite.com/page" /></label>
      <div className={styles.auditRows}>
        {["Page title", "Meta description", "Heading structure", "Search terms"].map((label) => (
          <div key={label}><span>{label}</span><span className={styles.pending}>Not checked</span></div>
        ))}
      </div>
      <button className={styles.disabledButton} disabled type="button">SEO analysis is not connected</button>
    </div>
  );
}

function ImageCompressorPreview() {
  return (
    <div className={`${styles.mockPanel} ${styles.uploadPanel}`}>
      <div className={styles.mockHeader}><span>Image compression</span><span>Preview</span></div>
      <div className={styles.dropArea}>
        <span className={styles.uploadMark} aria-hidden="true">↑</span>
        <strong>Choose an image to get started</strong>
        <span>JPG, PNG, or WebP</span>
        <button className={styles.disabledButton} disabled type="button">Image processing is not available yet</button>
      </div>
      <p className={styles.helper}>Files are not uploaded or processed in this interface preview.</p>
    </div>
  );
}

function ResumeBuilderPreview() {
  return (
    <div className={styles.resumeLayout}>
      <div className={styles.mockPanel}>
        <div className={styles.mockHeader}><span>Resume details</span><span>Preview</span></div>
        <label className={styles.inputRow}><span>Full name</span><input disabled placeholder="Your name" /></label>
        <label className={styles.inputRow}><span>Role or headline</span><input disabled placeholder="What you do" /></label>
        <label className={styles.inputRow}><span>Experience</span><textarea disabled placeholder="A short summary of your work" /></label>
        <button className={styles.disabledButton} disabled type="button">Resume builder is not available yet</button>
      </div>
      <div className={styles.resumePaper} aria-hidden="true">
        <span>YOUR NAME</span><i /> <i /> <i />
        <div /><span>EXPERIENCE</span><i /><i /><span>EDUCATION</span><i />
      </div>
    </div>
  );
}

const previews = {
  "website-audit": WebsiteAuditPreview,
  "seo-analyzer": SeoAnalyzerPreview,
  "image-compressor": ImageCompressorPreview,
  "resume-builder": ResumeBuilderPreview,
};

export default function PrototypeTool({ tool }) {
  const Preview = previews[tool.slug];

  return (
    <section className={styles.prototype}>
      <PreviewNotice />
      <div className={styles.prototypeIntro}>
        <p>{tool.summary}</p>
        <span>Concept workspace</span>
      </div>
      <Preview />
    </section>
  );
}
