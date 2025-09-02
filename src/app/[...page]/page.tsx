import { RenderBuilderContent } from "../../components/builder";
import { builder } from "../../lib/builder";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage(props: unknown) {
  const { params } = (props as { params?: { page?: string[] } }) ?? {};
  const builderModelName = "page";

  const page = (params?.page as string[] | undefined) ?? [];
  const urlPath = "/" + (page.join("/") || "");

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
