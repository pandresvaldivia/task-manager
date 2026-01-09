export type Board = {
  id: string;
  name: string;
  statuses: BoardStatus[];
};

export type BoardStatus = {
  id: string;
  name: string;
  boardId: string;
};

export type BoardSummary = Pick<Board, 'id' | 'name'>;
