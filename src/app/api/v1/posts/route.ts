import { NextRequest, NextResponse } from "next/server";
import posts from "~/data/posts.json";
import searchLike from "~/utils/search-like";

export const runtime = "edge";

export async function GET(request: NextRequest, response: NextResponse) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";
  const filteredPosts = !!searchQuery ? searchLike(posts, "title", searchQuery) : posts;

  const perPage = 10;
  const totalPosts = filteredPosts.length;
  const lastPage = Math.ceil(totalPosts / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return Response.json({
    data: paginatedPosts,
    meta: {
      current_page: page,
      from: startIndex + 1,
      to: endIndex > totalPosts ? totalPosts : endIndex,
      last_page: lastPage,
      per_page: perPage,
      total: totalPosts,
      path: `${request.nextUrl.origin}${request.nextUrl.pathname}`,
    },
  });
}
