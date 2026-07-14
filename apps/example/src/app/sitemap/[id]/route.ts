import { buildSitemapById, serializeSitemapUrlset } from "@/lib/sitemap";

export const revalidate = 3600;

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { id: rawId } = await params;
  const id = rawId.replace(/\.xml$/, "");

  try {
    const entries = buildSitemapById(id);
    return new Response(serializeSitemapUrlset(entries), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
