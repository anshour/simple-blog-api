// THIS FUNCTION IS FOR GENERATING POSTS.JSON FILE FROM MD FILE
// YOU SHOULD ONLY RUN THIS FUNCTION ONCE
import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";
import httpDb from "~/utils/mongodb-api";

export async function GET(request: NextRequest) {
  const files = await fs.readdir("./src/data/md", { withFileTypes: true });

  for (let index = 0; index < files.length; index++) {
    const filePath = path.join(files[index].path, files[index].name);
    const fullContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fullContent);

    await httpDb.request("/action/insertOne", {
      collection: "posts",
      document: {
        title: data.title,
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

  return NextResponse.json({ message: "Posts is successfully re-generated" });
}
