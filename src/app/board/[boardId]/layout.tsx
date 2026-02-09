import { getAllBoardsUseCase, getBoardByIdUseCase } from '@/main/dependencies';
import { Header } from '@/ui/header/components/header';

export default async function BoardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ boardId: string }>;
}>) {
  const { boardId } = await params;

  const [board, boards] = await Promise.all([
    getBoardByIdUseCase(boardId),
    getAllBoardsUseCase(),
  ]);

  if (!board) {
    throw new Error('Board not found');
  }

  const { name } = board;

  return (
    <div className='grid grid-rows-auto-fr w-full'>
      <Header name={name} boards={boards} />
      {children}
    </div>
  );
}
