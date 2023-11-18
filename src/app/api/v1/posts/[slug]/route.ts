import { NextRequest, NextResponse } from "next/server";
import posts from "~/data/posts.json";
import fs from "fs/promises";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const postData = posts.find((x) => x.slug === slug);

  if (!postData) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return Response.json({ ...postData });
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const { content } = await request.json();

  const postData = posts.find((x) => x.slug === slug);

  if (!postData) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await fs.writeFile(
    `./src/data/md/${postData.file}`,
    `---
id: "${postData.id}"
title: "${postData.title}"
author: "${postData.author}"
tags: ${postData.tags}
category: ${postData.category}
---

${content}`,
    "utf-8"
  );

  //REGENERATE posts.json
  await fetch(request.nextUrl.origin + "/api/v1/posts/generate");

  return NextResponse.json({ message: "Post updated successfully" });
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const postData = posts.find((x) => x.slug === slug);

  if (!postData) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await fs.unlink(`./src/data/md/${postData.file}`);

  //REGENERATE posts.json
  await fetch(request.nextUrl.origin + "/api/v1/posts/generate");

  return NextResponse.json({ message: "Post deleted successfully" });
}
