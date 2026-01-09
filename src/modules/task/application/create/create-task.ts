import {
  CreateTaskOptions,
  TaskRepository,
} from '../../domain/repositories/task-repository';

export function createTask(taskRepository: TaskRepository) {
  return async function execute(options: CreateTaskOptions) {
    const newTask = await taskRepository.createTask(options);
    return newTask;
  };
}
