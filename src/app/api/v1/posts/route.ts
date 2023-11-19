import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import mongodbApi from "~/utils/mongodb-api";
import pickRandomImage from "~/utils/pick-random-image";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";

  const resCount = await mongodbApi.request("/action/aggregate", {
    collection: "posts",
    pipeline: [
      {
        $match: {
          title: { $regex: searchQuery, $options: "i" },
        },
      },
      {
        $count: "totalPosts",
      },
    ],
  });

  const total =
    resCount.documents && resCount.documents.length ? resCount.documents[0].totalPosts : 0;
  const limit = 10;
  const lastPage = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const res = await mongodbApi.request("/action/find", {
    collection: "posts",
    filter: {
      title: { $regex: searchQuery, $options: "i" },
    },
    skip: startIndex,
    limit,
  });

  const posts = res.documents;

  return Response.json({
    // TODO: CHANGE POST TYPE
    data: posts.map((post: any) => ({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      image: post.image,
      tags: post.tags,
      category: post.category,
      preview: post.preview,
    })),
    meta: {
      current_page: page,
      from: startIndex + 1,
      to: endIndex > total ? total : endIndex,
      last_page: lastPage,
      per_page: limit,
      total,
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

  const oldPost = await mongodbApi.request("/action/findOne", {
    collection: "posts",
    filter: { slug },
  });

  if (oldPost.document?._id) {
    return NextResponse.json({
      message: "The post with that title already exist",
      status: 422,
    });
  }

  const res = await mongodbApi.request("/action/insertOne", {
    collection: "posts",
    document: {
      title,
      image: pickRandomImage(),
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
