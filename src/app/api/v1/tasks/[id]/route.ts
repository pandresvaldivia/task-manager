import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<'/api/v1/move-tasks/[id]'>
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: 'Task deleted successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            error: 'Task not found',
          },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
