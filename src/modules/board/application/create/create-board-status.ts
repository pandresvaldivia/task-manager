import { BoardRepository } from '../../domain/repositories/board-repository';

export function createBoardStatus(boardRepository: BoardRepository) {
  return async function execute(name: string): Promise<boolean> {
    return boardRepository.createStatus(name);
  };
}
