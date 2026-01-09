import { TaskRepository } from '../../domain/repositories/task-repository';
export function getTaskById(taskRepository: TaskRepository) {
  return async function execute(taskId: string) {
    const task = await taskRepository.getTaskById(taskId);
    return task;
  };
}
