import { NextRequest, NextResponse } from "next/server";
import searchLike from "~/utils/search-like";
import posts from "~/data/posts.json";
import slugify from "slugify";
import fs from "fs/promises";
import { v4 } from "uuid";

export async function GET(request: NextRequest) {
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
    data: paginatedPosts.map((post) => ({
      id: post.id,
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
  const id = v4();
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ message: "Title and content field is required" }, { status: 422 });
  }

  const slug = slugify(title, { lower: true });

  const postData = posts.find((x) => x.slug === slug);
  if (!!postData) {
    return NextResponse.json(
      { message: "The post with that title already exist" },
      { status: 422 }
    );
  }

  await fs.writeFile(
    `./src/data/md/${slug}.md`,
    `---
id: "${id}"
title: "${title}"
author: "John Doe"
tags: ["developer", "programming"]
category: "technology"
---

${content}`,
    "utf-8"
  );

  //REGENERATE posts.json
  await fetch(request.nextUrl.origin + "/api/v1/posts/generate");

  return NextResponse.json({
    message: "The post is saved successfully",
    slug: slug,
    id: id,
  });
}
