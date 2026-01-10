import { HttpRequestService } from '@/modules/shared/infrastructure/http/service/fetch-client';
import { BoardSummary, Board } from '../../domain/entities/board';
import {
  BoardRepository,
  CreateBoardOptions,
  UpdateBoardOptions,
} from '../../domain/repositories/board-repository';
import { ApiGenericResponse } from '@/modules/shared/infrastructure/http/dto/api-response';

export class ApiBoardRepository implements BoardRepository {
  private httpClient: HttpRequestService;

  constructor(httpClient: HttpRequestService) {
    this.httpClient = httpClient;
  }

  async getAllBoards(): Promise<BoardSummary[]> {
    const response = await this.httpClient.get<
      ApiGenericResponse<BoardSummary[]>
    >('board');

    if (response.success && response.data) {
      return response.data.data;
    }

    return [];
  }

  getBoardById(boardId: string): Promise<Board | null> {
    throw new Error('Method not implemented.');
  }
  createStatus(name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  updateBoard(options: UpdateBoardOptions): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  deleteBoard(boardId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  deleteStatus(statusId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  createBoard(options: CreateBoardOptions): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
