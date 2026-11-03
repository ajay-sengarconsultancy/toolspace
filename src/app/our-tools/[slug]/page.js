import { notFound } from "next/navigation";
import ToolWorkspace from "../../../components/internal-tools/ToolWorkspace";
import { internalTools } from "../../../data/internalTools";

export function generateStaticParams() {
  return internalTools.map(({ slug }) => ({ slug }));
}

export default async function InternalToolPage({ params }) {
  const { slug } = await params;
  const tool = internalTools.find((item) => item.slug === slug);

  if (!tool) notFound();

  return <ToolWorkspace tool={tool} />;
}
