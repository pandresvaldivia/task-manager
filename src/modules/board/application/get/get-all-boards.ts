import { BoardSummary } from '../../domain/entities/board';
import { BoardRepository } from '../../domain/repositories/board-repository';

export function getAllBoards(boardRepository: BoardRepository) {
  return async function execute(): Promise<BoardSummary[]> {
    return boardRepository.getAllBoards();
  };
}
