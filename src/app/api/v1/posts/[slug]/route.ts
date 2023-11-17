import { NextRequest, NextResponse } from "next/server";
import posts from "~/data/posts.json";

export const runtime = "edge";

export async function GET(request: NextRequest, response: NextResponse) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  const postData = posts.find((x) => x.slug === slug);

  if (!postData) {
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return Response.json({ ...postData });
}
