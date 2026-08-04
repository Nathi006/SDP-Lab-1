import { describe, expect, it } from "vitest";
import {
  archiveTask,
  createTask,
  createTopic,
  listTasks,
  listTopics,
  unarchiveTask,
  updateTask,
} from "@/lib/tasks";

function pastDate() {
  return "2000-01-01";
}
function futureDate() {
  return "2099-01-01";
}

describe("topics", () => {
  it("seeds a default topic on first use", () => {
    const topics = listTopics();
    expect(topics.length).toBeGreaterThanOrEqual(1);
    expect(topics.some((t) => t.name === "General")).toBe(true);
  });

  it("reuses an existing topic instead of creating a duplicate", () => {
    const first = createTopic("Home");
    const second = createTopic("Home");
    expect(second.id).toBe(first.id);
    expect(listTopics().filter((t) => t.name === "Home")).toHaveLength(1);
  });
});

describe("creating tasks", () => {
  it("defaults a new task to the todo status", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Water the plants", due_date: futureDate(), topic_id: topic.id });
    expect(task.status).toBe("todo");
    expect(task.archived_at).toBeNull();
  });

  it("rejects a task with no title", () => {
    const topic = createTopic("Home");
    expect(() =>
      createTask({ title: "   ", due_date: futureDate(), topic_id: topic.id })
    ).toThrow();
  });
});

describe("sorting", () => {
  it("sorts by due date ascending", () => {
    const topic = createTopic("Home");
    createTask({ title: "Later task", due_date: "2030-06-01", topic_id: topic.id });
    createTask({ title: "Earlier task", due_date: "2025-06-01", topic_id: topic.id });

    const tasks = listTasks({ sortField: "due_date", sortDirection: "asc" });
    expect(tasks.map((t) => t.title)).toEqual(["Earlier task", "Later task"]);
  });

  it("sorts by status in the fixed todo -> in_progress -> complete order, not alphabetically", () => {
    const topic = createTopic("Home");
    const complete = createTask({ title: "Done thing", due_date: futureDate(), topic_id: topic.id });
    const inProgress = createTask({ title: "Doing thing", due_date: futureDate(), topic_id: topic.id });
    const todo = createTask({ title: "Todo thing", due_date: futureDate(), topic_id: topic.id });

    updateTask(complete.id, { status: "complete" });
    updateTask(inProgress.id, { status: "in_progress" });

    const tasks = listTasks({ sortField: "status", sortDirection: "asc" });
    expect(tasks.map((t) => t.title)).toEqual(["Todo thing", "Doing thing", "Done thing"]);
  });

  it("sorts by topic name", () => {
    const zTopic = createTopic("Zoo");
    const aTopic = createTopic("Admin");
    createTask({ title: "Zoo task", due_date: futureDate(), topic_id: zTopic.id });
    createTask({ title: "Admin task", due_date: futureDate(), topic_id: aTopic.id });

    const tasks = listTasks({ sortField: "topic", sortDirection: "asc" });
    expect(tasks.map((t) => t.topic_name)).toEqual(["Admin", "Zoo"]);
  });
});

describe("archiving", () => {
  it("archives a task without deleting it, and it stays viewable", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Old task", due_date: futureDate(), topic_id: topic.id });

    archiveTask(task.id);

    const active = listTasks({ includeArchived: false });
    expect(active.find((t) => t.id === task.id)).toBeUndefined();

    const all = listTasks({ includeArchived: true });
    const archived = all.find((t) => t.id === task.id);
    expect(archived).toBeDefined();
    expect(archived!.archived_at).not.toBeNull();
  });

  it("can be restored with unarchiveTask", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Old task", due_date: futureDate(), topic_id: topic.id });
    archiveTask(task.id);
    unarchiveTask(task.id);

    const active = listTasks({ includeArchived: false });
    expect(active.find((t) => t.id === task.id)).toBeDefined();
  });
});

describe("the overdue rule", () => {
  it("flags an active, incomplete task with a past due date as overdue", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Late task", due_date: pastDate(), topic_id: topic.id });

    const [found] = listTasks({ includeArchived: false }).filter((t) => t.id === task.id);
    expect(found.is_overdue).toBe(1);
  });

  it("never flags a completed task as overdue, regardless of due date", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Late but done", due_date: pastDate(), topic_id: topic.id });
    updateTask(task.id, { status: "complete" });

    const [found] = listTasks({ includeArchived: false }).filter((t) => t.id === task.id);
    expect(found.is_overdue).toBe(0);
  });

  it("does not flag an archived task as overdue", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Late but archived", due_date: pastDate(), topic_id: topic.id });
    archiveTask(task.id);

    const [found] = listTasks({ includeArchived: true }).filter((t) => t.id === task.id);
    expect(found.is_overdue).toBe(0);
  });

  it("does not flag a future-dated task as overdue", () => {
    const topic = createTopic("Home");
    const task = createTask({ title: "Not due yet", due_date: futureDate(), topic_id: topic.id });

    const [found] = listTasks({ includeArchived: false }).filter((t) => t.id === task.id);
    expect(found.is_overdue).toBe(0);
  });
});
