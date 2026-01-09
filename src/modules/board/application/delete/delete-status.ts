import { BoardRepository } from '../../domain/repositories/board-repository';
import { TaskRepository } from '../../../task/domain/repositories/task-repository';

interface DeleteStatusOptions {
  id: string;
  forceDelete?: boolean;
}

export function deleteStatus({
  boardRepository,
  TaskRepository,
}: {
  boardRepository: BoardRepository;
  TaskRepository: TaskRepository;
}) {
  return async function execute({
    id,
    forceDelete,
  }: DeleteStatusOptions): Promise<boolean> {
    const taskCount = await TaskRepository.getTasksByStatus(id);

    if (taskCount.length > 0 && !forceDelete) {
      throw new Error(
        'Cannot delete status with associated tasks without forceDelete flag.'
      );
    }

    return boardRepository.deleteStatus(id);
  };
}
