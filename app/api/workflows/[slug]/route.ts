import { NextResponse } from "next/server";
import { getWorkflow } from "@/app/workflows";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const workflow = getWorkflow(slug);

  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  return NextResponse.json(workflow, {
    headers: {
      "Access-Control-Allow-Origin": "https://use-agently.com",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
