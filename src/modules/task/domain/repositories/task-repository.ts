import { Task } from '../entities/task';

export interface CreateTaskOptions {
  title: string;
  description?: string;
  statusId: string;
  subtasks?: CreateSubtaskOptions[];
}

export interface CreateSubtaskOptions {
  title: string;
}

export interface UpdateTaskOptions {
  id: string;
  title: string;
  description?: string;
  statusId: string;
  subtasks: UpdateSubtaskOptions[];
}

export interface UpdateSubtaskOptions {
  id?: string;
  title: string;
  isCompleted?: boolean;
}

export interface UpdateSubtaskStatusOptions {
  taskId: string;
  subtaskId: string;
  isCompleted: boolean;
}

export interface TaskRepository {
  getTaskById(taskId: string): Promise<Task | null>;
  getTasksByStatus(statusId: string): Promise<Task[]>;
  createTask(options: CreateTaskOptions): Promise<Task>;
  updateTask(options: UpdateTaskOptions): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  updateSubtaskStatus(options: UpdateSubtaskStatusOptions): Promise<Task>;
}
