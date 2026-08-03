import { NextRequest, NextResponse } from "next/server";
import { createTopic, listTopics } from "@/app/lib/tasks";

export async function GET() {
  return NextResponse.json({ topics: listTopics() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = createTopic(body.name);
    return NextResponse.json({ topic }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create topic";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
