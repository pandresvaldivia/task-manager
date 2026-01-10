import { getAllBoards } from '@/modules/board/application/get/get-all-boards';
import { ApiBoardRepository } from '@/modules/board/infrastructure/repositories/api-repository';
import { HttpRequestService } from '@/modules/shared/infrastructure/http/service/fetch-client';

const httpClient = new HttpRequestService();

const boardRepository = new ApiBoardRepository(httpClient);

export const getAllBoardsUseCase = getAllBoards(boardRepository);
