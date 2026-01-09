import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StatusScalarWhereInput } from '@/generated/prisma/models';
import z from 'zod';
import { handleApiError } from '@/modules/shared/helpers/api';

type BoardRoute = '/api/v1/board/[id]';

const idSchema = z.uuidv4('Invalid ID format');

export async function GET(
  _request: NextRequest,
  context: RouteContext<BoardRoute>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

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

    return NextResponse.json(
      {
        data: board,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError({
      error,
      model: 'Board',
      defaultMessage: 'Failed to get the board',
    });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<BoardRoute>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        data: { id },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError({
      error,
      model: 'Board',
      defaultMessage: 'Failed to delete board',
    });
  }
}

const putRequestSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
  statuses: z
    .array(
      z.object({
        id: z.uuidv4().optional(),
        name: z.string().min(1, 'Status name is required'),
      })
    )
    .optional(),
});

export async function PUT(
  request: NextRequest,
  context: RouteContext<BoardRoute>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

    const body = await request.json();
    const { name, statuses = [] } = putRequestSchema.parse(body);

    const statusesList: { id?: string; name: string }[] = [];
    const existingIds: StatusScalarWhereInput[] = [];

    for (const status of statuses) {
      if (status.id) {
        existingIds.push({ id: status.id });
      }

      statusesList.push({
        id: status.id,
        name: status.name.trim(),
      });
    }

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
  } catch (error) {
    return handleApiError({
      error,
      model: 'Board',
      defaultMessage: 'Failed to update board',
    });
  }
}
