import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/app/lib/tasks';

export async function GET(req: NextRequest) {
  const sortBy = req.nextUrl.searchParams.get('sortBy') as any;
  const includeArchived = req.nextUrl.searchParams.get('includeArchived') === 'true';
  const tasks = getTasks(sortBy, includeArchived);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title || !body.due_date || !body.topic) {
    return NextResponse.json({ error: 'title, due_date and topic are required' }, { status: 400 });
  }
  const task = createTask(body);
  return NextResponse.json(task, { status: 201 });
}