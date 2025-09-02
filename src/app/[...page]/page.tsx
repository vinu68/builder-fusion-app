import { RenderBuilderContent } from "../../components/builder";
import { builder } from "../../lib/builder";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage({ params }: { params: Promise<{ page?: string[] }> }) {
  const builderModelName = "page";

  const { page: slug } = await params;
  const segments = slug ?? [];
  const urlPath = "/" + (segments.join("/") || "");

  if (!process.env.NEXT_PUBLIC_BUILDER_API_KEY) {
    return null;
  }

  const content = await builder
    .get(builderModelName, {
      userAttributes: {
        urlPath,
      },
      cacheSeconds: 0,
      staleCacheSeconds: 0,
    })
    .toPromise();

  return <RenderBuilderContent content={content} model={builderModelName} />;
}
