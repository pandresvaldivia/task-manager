import { TaskRepository } from '../../../task/domain/repositories/task-repository';
import { BoardStatus } from '../../domain/entities/board';
import {
  BoardRepository,
  UpdateBoardOptions,
} from '../../domain/repositories/board-repository';

export function updateBoard(
  boardRepository: BoardRepository,
  taskRepository: TaskRepository
) {
  return async function execute({
    id,
    name,
    statuses,
  }: UpdateBoardOptions): Promise<boolean> {
    const currentBoard = await boardRepository.getBoardById(id);

    if (!currentBoard) {
      throw new Error('Board not found.');
    }

    const incomingStatusIds = new Set<string>();

    for (const status of currentBoard.statuses) {
      if (status.id) incomingStatusIds.add(status.id);
    }

    const removedStatuses = currentBoard.statuses.filter(
      (oldStatus) => !incomingStatusIds.has(oldStatus.id)
    );

    if (removedStatuses.length > 0) {
      const checkTasksPromises = removedStatuses.map((status) =>
        ensureStatusIsEmpty(status, taskRepository)
      );

      const results = await Promise.all(checkTasksPromises);

      const invalidRemovals: string[] = [];

      for (const result of results) {
        if (result.hasTasks) invalidRemovals.push(result.name);
      }

      if (invalidRemovals.length > 0) {
        throw new Error(
          `Cannot remove statuses with associated tasks: ${invalidRemovals.join(
            ', '
          )}`
        );
      }
    }

    return boardRepository.updateBoard({ id, name, statuses });
  };
}

async function ensureStatusIsEmpty(
  status: BoardStatus,
  taskRepository: TaskRepository
): Promise<{ name: string; hasTasks: boolean }> {
  const tasks = await taskRepository.getTasksByStatus(status.id);

  return { name: status.name, hasTasks: tasks.length > 0 };
}
