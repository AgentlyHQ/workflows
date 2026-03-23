import { NextResponse } from "next/server";
import { getWorkflows } from "@/app/workflows";

export async function GET() {
  const workflows = getWorkflows();
  return NextResponse.json(workflows, {
    headers: {
      "Access-Control-Allow-Origin": "https://use-agently.com",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
