import {
  TaskRepository,
  UpdateTaskOptions,
} from '../../domain/repositories/task-repository';

export function updateTask(taskRepository: TaskRepository) {
  return async function execute(options: UpdateTaskOptions) {
    const updatedTask = await taskRepository.updateTask(options);
    return updatedTask;
  };
}
