import { Suspense } from "react";
import RequestDetailsPage from "../../../components/requests/RequestDetailsPage";

async function RequestDetailsContent({ params, searchParams }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  return <RequestDetailsPage id={id} submitted={query?.submitted === "1"} />;
}

export default function RequestDetailsRoute({ params, searchParams }) {
  return (
    <Suspense fallback={<p>Loading request…</p>}>
      <RequestDetailsContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
