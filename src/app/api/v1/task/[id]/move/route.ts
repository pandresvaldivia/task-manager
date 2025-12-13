import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import z from 'zod';
import { handleApiError } from '@/modules/shared/helpers/api';

const idSchema = z.uuidv4('Invalid ID format');

const putRequestSchema = z.object({
  statusId: z.uuidv4(),
});

export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/v1/task/[id]/move'>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

    const body = await request.json();
    const { statusId } = putRequestSchema.parse(body);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: {
          connect: {
            id: statusId,
          },
        },
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return handleApiError({
      error,
      model: 'Task',
      defaultMessage: 'Failed to move the task',
    });
  }
}
