"use client";

import { useCallback, useEffect, useState } from "react";
import { SortDirection, SortField, Status, Task, Topic } from "@/lib/tasks";
import { SortBar } from "./SortBar";
import { TaskCard } from "./TaskCard";
import { TaskFormModal } from "./TaskFormModal";

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sortField, setSortField] = useState<SortField>("due_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams({
        sort: sortField,
        dir: sortDirection,
        archived: String(showArchived),
      });
      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTasks(data.tasks);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [sortField, sortDirection, showArchived]);

  const loadTopics = useCallback(async () => {
    const res = await fetch("/api/topics");
    if (res.ok) {
      const data = await res.json();
      setTopics(data.topics);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  async function handleStatusChange(id: number, status: Status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) loadTasks();
  }

  async function handleArchive(id: number) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive" }),
    });
    loadTasks();
  }

  async function handleUnarchive(id: number) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unarchive" }),
    });
    loadTasks();
  }

  async function handleCreateTopic(name: string): Promise<Topic> {
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Could not create topic");
    const data = await res.json();
    setTopics((prev) => {
      if (prev.some((t) => t.id === data.topic.id)) return prev;
      return [...prev, data.topic].sort((a, b) => a.name.localeCompare(b.name));
    });
    return data.topic;
  }

  async function handleFormSubmit(values: {
    title: string;
    description: string;
    due_date: string;
    topic_id: number;
  }) {
    const isEdit = !!editingTask;
    const url = isEdit ? `/api/tasks/${editingTask!.id}` : "/api/tasks";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Could not save task");
    }

    setModalOpen(false);
    setEditingTask(null);
    loadTasks();
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-3 pb-24 sm:px-6">
      <header className="brutal-panel mt-4 flex items-center justify-between bg-wa-teal px-4 py-4 sm:px-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Tasks</h1>
          <p className="font-mono text-xs text-wa-mint">local-first · runs on your machine</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="brutal-btn bg-wa px-4 py-2.5 text-sm text-ink"
        >
          + New task
        </button>
      </header>

      <div className="brutal-panel mt-4 bg-white px-4 py-3 sm:px-6">
        <SortBar
          sortField={sortField}
          sortDirection={sortDirection}
          showArchived={showArchived}
          onSortFieldChange={setSortField}
          onDirectionToggle={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
          onToggleArchived={() => setShowArchived((v) => !v)}
        />
      </div>

      <main className="mt-4 flex flex-col gap-4">
        {loading && (
          <p className="brutal-panel bg-white px-4 py-6 text-center font-mono text-sm text-ink/60">
            Loading tasks…
          </p>
        )}

        {loadError && (
          <p className="brutal-panel bg-status-overdue px-4 py-4 text-center text-sm font-bold text-white">
            {loadError}
          </p>
        )}

        {!loading && !loadError && tasks.length === 0 && (
          <div className="brutal-panel bg-white px-4 py-10 text-center">
            <p className="font-display text-lg font-bold text-ink">
              {showArchived ? "Nothing archived yet" : "Nothing on the list"}
            </p>
            <p className="mt-1 font-mono text-xs text-ink/60">
              {showArchived ? "Archived tasks show up here." : "Tap “+ New task” to add one."}
            </p>
          </div>
        )}

        {!loading &&
          !loadError &&
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={(t) => {
                setEditingTask(t);
                setModalOpen(true);
              }}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
            />
          ))}
      </main>

      {modalOpen && (
        <TaskFormModal
          topics={topics}
          task={editingTask}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleFormSubmit}
          onCreateTopic={handleCreateTopic}
        />
      )}
    </div>
  );
}
