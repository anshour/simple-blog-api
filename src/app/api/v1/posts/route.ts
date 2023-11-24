import { NextRequest, NextResponse } from "next/server";
import pickRandomImage from "~/utils/pick-random-image";
import mongodbApi from "~/utils/mongodb-api";
import slugify from "slugify";
import { PostSchema } from "~/schema/PostSchema";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const res = await mongodbApi.aggregate({
    collection: "posts",
    pipeline: [
      {
        $match: {
          title: { $regex: searchQuery, $options: "i" },
          category: category || { $exists: true },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          posts: [{ $skip: startIndex }, { $limit: limit }],
        },
      },
    ],
  });

  const posts = res.documents[0].posts;
  const total = res.documents[0].metadata[0]?.total || 0;

  return Response.json({
    // TODO: CHANGE POST TYPE
    data: posts.map((post: any) => ({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      image: post.image,
      tags: post.tags,
      author: post.author,
      category: post.category,
      preview: post.preview,
    })),
    meta: {
      current_page: page,
      from: startIndex + 1,
      to: endIndex > total ? total : endIndex,
      last_page: Math.ceil(total / limit),
      per_page: limit,
      total,
      path: `${request.nextUrl.origin}${request.nextUrl.pathname}`,
    },
  });
}

export async function POST(request: NextRequest) {
  const { title, content, author, category } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ message: "Title and content field is required" }, { status: 422 });
  }
  const slug = slugify(title, { lower: true });

  const oldPost = await mongodbApi.findOne({
    collection: "posts",
    filter: { slug },
  });

  if (oldPost.document?._id) {
    return NextResponse.json({
      message: "The post with that title already exist",
      status: 422,
    });
  }

  const validatedPost = PostSchema.safeParse({
    title,
    image: pickRandomImage(),
    slug,
    tags: ["programming", "coding"],
    category: category || "technology",
    author: author || "John Doe",
    preview: content.slice(0, 200).replace("\n", "").replace("\r", "") + "...",
    content,
  });

  if (!validatedPost.success) {
    return NextResponse.json({
      message: "Validation error",
      status: 422,
      errors: validatedPost.error.issues,
    });
  }

  const res = await mongodbApi.insertOne({
    collection: "posts",
    document: {
      ...validatedPost.data,
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
