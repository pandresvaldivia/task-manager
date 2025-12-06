import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { isValidString } from '@/modules/shared/helpers/string';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/v1/subtask/[id]'>
) {
  const { id } = await context.params;
  const { completed } = await request.json();

  if (!isValidString(id)) {
    return NextResponse.json({ error: 'Missing subtask id' }, { status: 400 });
  }

  if (completed === undefined) {
    return NextResponse.json(
      { error: 'Missing completed value' },
      { status: 400 }
    );
  }

  if (typeof completed !== 'boolean') {
    return NextResponse.json(
      { error: 'Completed value must be a boolean' },
      { status: 400 }
    );
  }

  try {
    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: {
        completed,
      },
    });

    return NextResponse.json(updatedSubtask, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            error: 'Subtask not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: `Failed to update the subtask with id: ${id}` },
      { status: 500 }
    );
  }
}
