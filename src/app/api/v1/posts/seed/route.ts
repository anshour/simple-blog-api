// THIS FUNCTION IS FOR SEEDING THE DATABASE
// YOU SHOULD ONLY RUN THIS FUNCTION ONCE
import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";
import mongodbApi from "~/utils/mongodb-api";
import pickRandomImage from "~/utils/pick-random-image";

export async function GET(request: NextRequest) {
  const reset = request.nextUrl.searchParams.get("reset");
  if (reset) {
    await mongodbApi.request("/action/deleteMany", {
      collection: "posts",
      filter: {},
    });
  }

  const files = await fs.readdir("./src/seed/md", { withFileTypes: true });

  for (let index = 0; index < files.length; index++) {
    const filePath = path.join(files[index].path, files[index].name);
    const fullContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fullContent);

    await mongodbApi.request("/action/insertOne", {
      collection: "posts",
      document: {
        title: data.title,
        image: pickRandomImage(),
        slug: slugify(data.title, { lower: true }),
        tags: data.tags,
        category: data.category,
        author: data.author,
        preview: content.slice(0, 200).replace("\n", "").replace("\r", "") + "...",
        content,
        created_at: {
          $date: new Date().toISOString(),
        },
        updated_at: null,
      },
    });
  }

  return NextResponse.json({ message: "Posts is successfully seeded" });
}
