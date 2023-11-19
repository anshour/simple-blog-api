import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import httpDb from "~/utils/mongodb-api";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";

  // TODO: USE AGGREGATE FUNCTION
  const res = await httpDb.request("/action/find", {
    collection: "posts",
    filter: {
      title: { $regex: searchQuery, $options: "i" }, // Case-insensitive search for 'program' in the title
    },
  });

  const posts = res.documents;

  const perPage = 10;
  const totalPosts = posts.length;
  const lastPage = Math.ceil(totalPosts / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return Response.json({
    // TODO: CHANGE POST TYPE
    data: paginatedPosts.map((post: any) => ({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      tags: post.tags,
      category: post.category,
      preview: post.preview,
    })),
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

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ message: "Title and content field is required" }, { status: 422 });
  }
  const slug = slugify(title, { lower: true });

  const oldPost = await httpDb.request("/action/findOne", {
    collection: "posts",
    filter: { slug },
  });

  if (oldPost.document?._id) {
    return NextResponse.json({
      message: "The post with that title already exist",
      status: 422,
    });
  }

  const res = await httpDb.request("/action/insertOne", {
    collection: "posts",
    document: {
      title,
      slug,
      tags: ["programming", "coding"],
      category: "technology",
      author: "John Doe",
      preview: content.slice(0, 200).replace("\n", "").replace("\r", "") + "...",
      content,
      created_at: {
        $date: new Date().toISOString(),
      },
      updated_at: null,
    },
  });

  return NextResponse.json({
    message: "The post is saved successfully",
    slug: slug,
    id: res.insertedId,
  });
}
