'use client';

import { useEffect, useState } from 'react';
import { TaskWithComputed } from '@/app/lib/types';
import { Header } from '@/app/components/Header';
import { SortPills } from '@/app/components/SortPills';
import { TaskList } from '@/app/components/TaskList';
import { FAB } from '@/app/components/FAB';
import { TaskForm } from '@/app/components/TaskForm';

type SortField = 'topic' | 'status' | 'due_date';

export default function Home() {
  const [tasks, setTasks] = useState<TaskWithComputed[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('due_date');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TaskWithComputed | null>(null);

  async function loadTasks() {
    const res = await fetch(`/api/tasks?sortBy=${sortBy}`);
    setTasks(await res.json());
  }

  useEffect(() => {
    loadTasks();
  }, [sortBy]);

  async function handleSubmit(data: { title: string; description?: string; due_date: string; topic: string }) {
    if (editing) {
      await fetch(`/api/tasks/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    setFormOpen(false);
    setEditing(null);
    loadTasks();
  }

  async function handleArchive(id: number) {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archive: true }),
    });
    loadTasks();
  }

  return (
    <main className="min-h-screen pb-24">
      <Header />
      <SortPills active={sortBy} onChange={setSortBy} />
      <TaskList
        tasks={tasks}
        onEdit={(t) => {
          setEditing(t);
          setFormOpen(true);
        }}
        onArchive={handleArchive}
      />
      <FAB onClick={() => setFormOpen(true)} />
      {formOpen && (
        <TaskForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}