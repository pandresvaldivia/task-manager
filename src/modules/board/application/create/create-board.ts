import { BoardRepository } from '../../domain/repositories/board-repository';

export function createBoard(boardRepository: BoardRepository) {
  return async function execute(name: string): Promise<boolean> {
    return boardRepository.createBoard({ name });
  };
}
