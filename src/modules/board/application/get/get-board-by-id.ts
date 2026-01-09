import { Board } from '../../domain/entities/board';
import { BoardRepository } from '../../domain/repositories/board-repository';

export function getBoardById(boardRepository: BoardRepository) {
  return async function execute(id: string): Promise<Board | null> {
    const board = await boardRepository.getBoardById(id);

    if (!board) {
      throw new Error('Board not found.');
    }

    return board;
  };
}
