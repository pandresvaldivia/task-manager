import {
  TaskRepository,
  UpdateSubtaskStatusOptions,
} from '../../domain/repositories/task-repository';

export function updateSubtaskStatus(taskRepository: TaskRepository) {
  return async function execute(options: UpdateSubtaskStatusOptions) {
    const updatedTask = await taskRepository.updateSubtaskStatus(options);
    return updatedTask;
  };
}
