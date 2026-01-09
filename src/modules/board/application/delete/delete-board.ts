import { BoardRepository } from '../../domain/repositories/board-repository';

export function deleteBoard(boardRepository: BoardRepository) {
  return async function execute(id: string): Promise<boolean> {
    return boardRepository.deleteBoard(id);
  };
}
