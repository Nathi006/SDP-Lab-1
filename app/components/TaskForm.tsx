'use client';

import { useState } from 'react';
import { TaskWithComputed } from '@/app/lib/types';

export function TaskForm({
  initial,
  onSubmit,
  onClose,
}: {
  initial?: Partial<TaskWithComputed>;
  onSubmit: (data: { title: string; description?: string; due_date: string; topic: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '');
  const [topic, setTopic] = useState(initial?.topic_name ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate || !topic) return;
    onSubmit({ title, description, due_date: dueDate, topic });
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-end sm:items-center justify-center z-30 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card border-[3px] border-ink shadow-brutal-lg w-full max-w-md p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base">{initial ? 'Edit task' : 'New task'}</h2>
          <button type="button" onClick={onClose} className="press font-mono text-sm border-2 border-ink px-2 shadow-brutal-sm">
            ✕
          </button>
        </div>

        <label className="block font-mono text-xs uppercase mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-2 border-ink p-2 mb-3 font-body focus:outline-none focus:shadow-brutal-sm"
          required
        />

        <label className="block font-mono text-xs uppercase mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-2 border-ink p-2 mb-3 font-body focus:outline-none focus:shadow-brutal-sm"
          rows={3}
        />

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block font-mono text-xs uppercase mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border-2 border-ink p-2 font-mono text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-mono text-xs uppercase mb-1">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="New or existing"
              className="w-full border-2 border-ink p-2 font-body"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="press w-full bg-wagreen text-white font-display text-sm py-2 border-2 border-ink shadow-brutal"
        >
          {initial ? 'Save changes' : 'Add task'}
        </button>
      </form>
    </div>
  );
}