import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

export async function GET(
  _request: NextRequest,
  context: RouteContext<'/api/v1/boards/[id]'>
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        statuses: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: board,
      },
      {
        status: 200,
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<'/api/v1/boards/[id]'>
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: 'Board deleted successfully',
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
            error: 'Board not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    );
  }
}
