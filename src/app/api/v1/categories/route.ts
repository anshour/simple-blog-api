import { NextResponse } from "next/server";
import mongodbApi from "~/utils/mongodb-api";

export const runtime = "edge";

export async function GET() {
  const res = await mongodbApi.aggregate({
    collection: "posts",
    pipeline: [{ $group: { _id: "$category" } }],
  });

  return NextResponse.json({
    data: res.documents.map((doc: any) => doc._id),
  });
}
