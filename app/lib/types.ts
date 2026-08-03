export type Status = 'todo' | 'in_progress' | 'complete';

export interface Topic {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  topic_id: number;
  status: Status;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

// What the API actually returns — task joined with topic name, plus computed field
export interface TaskWithComputed extends Task {
  topic_name: string;
  is_overdue: boolean;
}