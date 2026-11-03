import { Suspense } from "react";
import DiscoveryPage from "../../components/discovery/DiscoveryPage";

async function DiscoveryRouteContent({ searchParams }) {
  const params = await searchParams;
  const value = (item) => Array.isArray(item) ? item[0] : item;

  return (
    <DiscoveryPage
      initialCategory={value(params?.category) ?? ""}
      initialPage={value(params?.page) ?? 1}
      initialPricing={value(params?.pricing) ?? ""}
      initialQuery={value(params?.q) ?? ""}
    />
  );
}

export default function DiscoverRoute({ searchParams }) {
  return (
    <Suspense fallback={null}>
      <DiscoveryRouteContent searchParams={searchParams} />
    </Suspense>
  );
}
