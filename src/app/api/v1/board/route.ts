import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handleApiError } from '@/modules/shared/helpers/api';
import z from 'zod';
import { StatusCreateManyBoardInput } from '@/generated/prisma/models';

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
  } catch (error) {
    return handleApiError({
      error,
      model: 'Board',
      defaultMessage: 'Failed to get boards',
    });
  }
}

const postBoardSchema = z.object({
  name: z.string().min(1, 'Board name cannot be empty'),
  statuses: z
    .array(z.object({ name: z.string().min(1, 'Status name cannot be empty') }))
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, statuses = [] } = postBoardSchema.parse(body);

    const statusesList: StatusCreateManyBoardInput[] = statuses.map(
      (status: unknown) => {
        return {
          name: (status as string).trim(),
        };
      }
    );

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
  } catch (error) {
    return handleApiError({
      error,
      model: 'Board',
      defaultMessage: 'Failed to create board',
    });
  }
}
