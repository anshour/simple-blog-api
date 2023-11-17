// YOU SHOULD ONLY RUN THIS FILE ON DEVELOPMENT
// THIS FUNCTION IS FOR GENERATING POSTS.JSON FILE FROM MD FILE
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export async function GET(request: NextRequest, response: NextResponse) {
  const files = fs.readdirSync("./src/data/md", { withFileTypes: true });

  const blogPosts = [];
  for (let index = 0; index < files.length; index++) {
    const filePath = path.join(files[index].path, files[index].name);
    const fullContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fullContent);

    blogPosts.push({
      //TODO: MOVE ID TO MD FILE
      id: index + 1,
      title: data.title,
      slug: slugify(data.title, { lower: true }),
      tags: data.tags,
      category: data.category,
      author: data.author,
      content,
      //TODO: ADD PREVIEW
      // preview: "",
    });
  }

  fs.writeFileSync("./src/data/posts.json", JSON.stringify(blogPosts, null, 2));

  return Response.json({ message: "Posts is successfully re-generated" });
}
