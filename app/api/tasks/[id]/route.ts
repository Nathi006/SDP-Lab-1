import { NextRequest, NextResponse } from 'next/server';
import { updateTask, archiveTask } from '@/app/lib/tasks';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();

  const task = body.archive ? archiveTask(id) : updateTask(id, body);
  if (!task) return NextResponse.json({ error: 'not found' }, { status: 404 });

  return NextResponse.json(task);
}