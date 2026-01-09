import { TaskRepository } from '../../domain/repositories/task-repository';

export function getTasksByStatus(taskRepository: TaskRepository) {
  return async function execute(statusId: string) {
    const tasks = await taskRepository.getTasksByStatus(statusId);
    return tasks;
  };
}
