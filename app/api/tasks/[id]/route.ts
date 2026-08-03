import { NextRequest, NextResponse } from "next/server";
import { archiveTask, getTask, unarchiveTask, updateTask } from "@/app/lib/tasks";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const task = getTask(Number(params.id));
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ task });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    // Archive / unarchive are modelled as an explicit action rather than a
    // status value, since the brief treats archiving as separate from status.
    if (body.action === "archive") {
      return NextResponse.json({ task: archiveTask(id) });
    }
    if (body.action === "unarchive") {
      return NextResponse.json({ task: unarchiveTask(id) });
    }

    const task = updateTask(id, {
      title: body.title,
      description: body.description,
      due_date: body.due_date,
      topic_id: body.topic_id !== undefined ? Number(body.topic_id) : undefined,
      status: body.status,
    });
    return NextResponse.json({ task });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update task";
    const status = message === "Task not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
