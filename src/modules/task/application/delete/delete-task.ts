import { TaskRepository } from '../../domain/repositories/task-repository';

export function deleteTask(taskRepository: TaskRepository) {
  return async function execute(taskId: string) {
    const result = await taskRepository.deleteTask(taskId);
    return result;
  };
}
