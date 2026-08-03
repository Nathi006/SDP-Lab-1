import { NextRequest, NextResponse } from "next/server";
import { createTask, listTasks, SortField, SortDirection } from "@/lib/tasks";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortField = (searchParams.get("sort") as SortField) || "due_date";
  const sortDirection = (searchParams.get("dir") as SortDirection) || "asc";
  const includeArchived = searchParams.get("archived") === "true";

  const validFields: SortField[] = ["due_date", "topic", "status"];
  if (!validFields.includes(sortField)) {
    return NextResponse.json({ error: "Invalid sort field" }, { status: 400 });
  }

  const tasks = listTasks({ sortField, sortDirection, includeArchived });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = createTask({
      title: body.title,
      description: body.description ?? null,
      due_date: body.due_date,
      topic_id: Number(body.topic_id),
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
