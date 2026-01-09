import { Board, BoardSummary } from '../entities/board';

export interface UpdateBoardOptions {
  id: string;
  name: string;
  statuses: UpdateBoardStatuses[];
}

interface UpdateBoardStatuses {
  id?: string;
  name: string;
}

export interface CreateBoardOptions {
  name: string;
}

export interface BoardRepository {
  getAllBoards(): Promise<BoardSummary[]>;
  getBoardById(boardId: string): Promise<Board | null>;
  createBoard(options: CreateBoardOptions): Promise<boolean>;
  createStatus(name: string): Promise<boolean>;
  updateBoard(options: UpdateBoardOptions): Promise<boolean>;
  deleteBoard(boardId: string): Promise<boolean>;
  deleteStatus(statusId: string): Promise<boolean>;
}
