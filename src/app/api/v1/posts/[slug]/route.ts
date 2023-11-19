import { NextRequest, NextResponse } from "next/server";
import mongodbApi from "~/utils/mongodb-api";

export const runtime = "edge";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const res = await mongodbApi.request("/action/findOne", {
    collection: "posts",
    filter: {
      slug,
    },
  });

  const postData = res.document;

  if (!postData) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return Response.json({ ...postData });
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ message: "Content field is required" }, { status: 422 });
  }

  const res = await mongodbApi.request("/action/findOne", {
    collection: "posts",
    filter: {
      slug,
    },
  });

  const postData = res.document;

  if (!postData) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await mongodbApi.request("/action/updateOne", {
    collection: "posts",
    filter: {
      _id: postData.id,
    },
    update: {
      $set: {
        preview: content.slice(0, 200).replace("\n", "").replace("\r", "") + "...",
        content,
        updated_at: {
          $date: new Date().toISOString(),
        },
      },
    },
  });

  return NextResponse.json({ message: "Post updated successfully" });
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const res = await mongodbApi.request("/action/findOne", {
    collection: "posts",
    filter: {
      slug,
    },
  });

  const postData = res.document;

  if (!postData) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await mongodbApi.request("/action/deleteOne", {
    collection: "posts",
    filter: {
      slug,
    },
  });

  return NextResponse.json({ message: "Post deleted successfully" });
}
