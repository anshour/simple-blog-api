// THIS FUNCTION IS FOR GENERATING POSTS.JSON FILE FROM MD FILE
import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const files = await fs.readdir("./src/data/md", { withFileTypes: true });

  const blogPosts = [];
  for (let index = 0; index < files.length; index++) {
    const filePath = path.join(files[index].path, files[index].name);
    const fullContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fullContent);

    blogPosts.push({
      id: data.id,
      title: data.title,
      file: files[index].name,
      slug: slugify(data.title, { lower: true }),
      tags: data.tags,
      category: data.category,
      author: data.author,
      preview: content.slice(0, 200).replace("\n", "").replace("\r", "") + "...",
      content,
    });
  }

  await fs.writeFile("./src/data/posts.json", JSON.stringify(blogPosts, null, 2));

  return NextResponse.json({ message: "Posts is successfully re-generated" });
}
