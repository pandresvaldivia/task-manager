import { type NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import type { StatusScalarWhereInput } from '@/generated/prisma/models';
import prisma from '@/lib/prisma';
import { isValidString } from '@/modules/shared/helpers/string';

export async function GET() {
  try {
    const boards = await prisma.board.findMany();

    return NextResponse.json(
      {
        data: boards,
      },
      {
        status: 200,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Failed to fetch boards',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const { name, statuses = [] } = await request.json();

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

  const statusesList = statuses.map((status: unknown) => {
    if (!isValidString(status)) {
      return NextResponse.json(
        {
          error: 'All statuses must be non-empty strings',
        },
        {
          status: 400,
        }
      );
    }

    return {
      name: (status as string).trim(),
    };
  });

  try {
    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        statuses: {
          createMany: {
            data: statusesList,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: board,
      },
      {
        status: 201,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Failed to create board',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { id, name, statuses = [] } = await request.json();

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
