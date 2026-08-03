"use client";

import { FormEvent, useEffect, useState } from "react";
import { Task, Topic } from "@/app/lib/tasks";

interface Props {
  topics: Topic[];
  task: Task | null;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    due_date: string;
    topic_id: number;
  }) => Promise<void>;
  onCreateTopic: (name: string) => Promise<Topic>;
}

export function TaskFormModal({ topics, task, onClose, onSubmit, onCreateTopic }: Props) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [topicId, setTopicId] = useState<number | "new">(task?.topic_id ?? topics[0]?.id ?? "new");
  const [newTopicName, setNewTopicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!dueDate) return setError("Due date is required.");

    setSubmitting(true);
    try {
      let finalTopicId: number;
      if (topicId === "new") {
        if (!newTopicName.trim()) {
          setError("Enter a name for the new topic.");
          setSubmitting(false);
          return;
        }
        const created = await onCreateTopic(newTopicName.trim());
        finalTopicId = created.id;
      } else {
        finalTopicId = topicId;
      }

      await onSubmit({ title, description, due_date: dueDate, topic_id: finalTopicId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="brutal-panel w-full max-w-md p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">
            {task ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="brutal-btn h-8 w-8 bg-white text-sm text-ink"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase text-ink/60">Title</span>
            <input
              className="brutal-input px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase text-ink/60">Description</span>
            <textarea
              className="brutal-input px-3 py-2 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase text-ink/60">Due date</span>
            <input
              type="date"
              className="brutal-input px-3 py-2 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase text-ink/60">Topic</span>
            <select
              className="brutal-input px-3 py-2 text-sm"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value === "new" ? "new" : Number(e.target.value))}
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
              <option value="new">+ New topic…</option>
            </select>
          </label>

          {topicId === "new" && (
            <input
              className="brutal-input px-3 py-2 text-sm"
              placeholder="New topic name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
            />
          )}

          {error && (
            <p className="brutal-chip bg-status-overdue px-3 py-2 text-xs font-bold text-white">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="brutal-btn mt-2 bg-wa px-4 py-2.5 text-sm text-ink"
          >
            {submitting ? "Saving…" : task ? "Save changes" : "Create task"}
          </button>
        </form>
      </div>
    </div>
  );
}
