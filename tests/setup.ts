import fs from "fs";
import os from "os";
import path from "path";
import { beforeEach } from "vitest";
import { resetDbConnection } from "@/lib/db";

// Every test gets its own throwaway database file so tests never touch (or
// depend on) the developer's real data/todo.db, and never leak state
// between tests.
beforeEach(() => {
  resetDbConnection();
  const dbPath = path.join(os.tmpdir(), `todo-test-${process.pid}-${Date.now()}-${Math.random()}.db`);
  process.env.TODO_DB_PATH = dbPath;

  return () => {
    // Windows locks open file handles, so the connection must be closed
    // before the file can be deleted (POSIX allows deleting an open file;
    // Windows doesn't).
    resetDbConnection();
    for (const suffix of ["", "-wal", "-shm", "-journal"]) {
      const f = dbPath + suffix;
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  };
});
