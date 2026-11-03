import Link from "next/link";
import HomeSearch from "../components/home/HomeSearch";
import { FeaturedTools, RoadmapPreview } from "../components/home/HomeHighlights";
import styles from "./page.module.css";

const entryPoints = [
  {
    number: "01",
    title: "Discover",
    description: "Find the right tools for the work ahead.",
    href: "/discover",
    symbol: "↗",
  },
  {
    number: "02",
    title: "Our Tools",
    description: "Use practical tools, right here on Toolspace.",
    href: "/our-tools",
    symbol: "↗",
  },
  {
    number: "03",
    title: "Request a Tool",
    description: "Tell us what’s missing and follow its progress.",
    href: "/requests/new",
    symbol: "↗",
  },
];

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-heading">
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowRule} /> A better way to find your next tool
        </p>
        <h1 id="home-heading">
          Build with the right tools.
          <br />
          <em>Make room for what’s next.</em>
        </h1>
        <p className={styles.intro}>
          A thoughtful collection of tools for the people building something from the ground up.
        </p>
        <HomeSearch />
        <p className={styles.searchHint}>
          Start with a need: <span>customer support</span>, <span>project planning</span>, <span>launching a site</span>
        </p>
      </section>

      <section className={styles.entryPoints} aria-label="Explore Toolspace">
        {entryPoints.map((entry) => (
          <Link className={styles.entryCard} href={entry.href} key={entry.number}>
            <span className={styles.entryNumber}>{entry.number}</span>
            <span className={styles.entryCopy}>
              <strong>{entry.title}</strong>
              <span>{entry.description}</span>
            </span>
            <span className={styles.entryArrow} aria-hidden="true">{entry.symbol}</span>
          </Link>
        ))}
      </section>

      <section className={styles.featuredSection} aria-labelledby="featured-heading">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>A few good places to start</p>
            <h2 id="featured-heading">Featured tools</h2>
          </div>
          <Link className={styles.textLink} href="/discover">
            Browse all tools <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <FeaturedTools />
      </section>

      <section className={styles.roadmap} aria-labelledby="roadmap-heading">
        <div className={styles.roadmapIntro}>
          <p className={styles.kicker}>Built with founders</p>
          <h2 id="roadmap-heading">What’s on the <em>roadmap</em></h2>
          <p>Good ideas come from the people doing the work. Here’s what the community has asked us to explore.</p>
          <Link className={styles.textLink} href="/roadmap">
            View the roadmap <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <RoadmapPreview />
      </section>
    </div>
  );
}
