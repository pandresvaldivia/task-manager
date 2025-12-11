import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { StatusScalarWhereInput } from '@/generated/prisma/models';
import { isValidString } from '@/modules/shared/helpers/string';

export async function GET(
  _request: NextRequest,
  context: RouteContext<'/api/v1/boards/[id]'>
) {
  const { id } = await context.params;

  if (!isValidString(id)) {
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

  if (!isValidString(id)) {
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

export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/v1/boards/[id]'>
) {
  const { id } = await context.params;
  const { name, statuses = [] } = await request.json();

  if (!isValidString(id)) {
    return NextResponse.json(
      {
        error: 'Board id is required',
      },
      {
        status: 400,
      }
    );
  }

  if (!isValidString(name)) {
    return NextResponse.json(
      {
        error: 'Board name is required',
      },
      {
        status: 400,
      }
    );
  }

  if (statuses && !Array.isArray(statuses)) {
    return NextResponse.json(
      {
        error: 'Statuses must be a valid JSON array',
      },
      {
        status: 400,
      }
    );
  }

  const statusesList: { id?: string; name: string }[] = [];
  const existingIds: StatusScalarWhereInput[] = [];

  for (const status of statuses) {
    if (!isValidString(status.name)) {
      return NextResponse.json(
        {
          error: 'All statuses must have a name',
        },
        {
          status: 400,
        }
      );
    }

    if (status.id) {
      existingIds.push({ id: status.id });
    }

    statusesList.push({
      id: status.id,
      name: status.name.trim(),
    });
  }

  try {
    const board = await prisma.board.update({
      where: { id },
      data: {
        name: name.trim(),
        statuses: {
          deleteMany: {
            boardId: id,
            NOT: existingIds,
          },
          upsert: statusesList.map((status) => ({
            where: { id: status.id ?? '' },
            create: { name: status.name },
            update: { name: status.name },
          })),
        },
      },
    });

    return NextResponse.json(
      {
        data: board,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log({ error: e });
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
      if (e.code === 'P2025') {
        return NextResponse.json(
          {
            error: 'Board not found',
          },
          {
            status: 404,
          }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to update board',
      },
      {
        status: 500,
      }
    );
  }
}
