import { Suspense } from "react";
import ToolDetailPage from "../../../components/discovery/ToolDetailPage";

async function DiscoverToolContent({ params }) {
  const { slug } = await params;
  return <ToolDetailPage slug={slug} />;
}

export default function DiscoverToolRoute({ params }) {
  return (
    <Suspense fallback={<p>Loading tool…</p>}>
      <DiscoverToolContent params={params} />
    </Suspense>
  );
}
