export type Task = {
  id: string;
  title: string;
  description: string | null;
  statusId: string;
  subtasks: Subtask[];
};

export type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
};

export function getSubtaskProgress(task: Task): {
  completed: number;
  total: number;
} {
  if (task.subtasks.length === 0) return { completed: 0, total: 0 };
  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.isCompleted
  ).length;

  return {
    completed: completedSubtasks,
    total: task.subtasks.length,
  };
}

export function canAddSubtask(task: Task): boolean {
  return task.subtasks.length < 20;
}

export function hasValidTitle(task: Task): boolean {
  return task.title.trim().length > 0;
}
