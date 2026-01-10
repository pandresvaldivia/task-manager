import prisma from '@/lib/prisma';
impor'@/modules/shared/infrastructure/next/helpers/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const idSchema = z.uuidv4('Invalid ID format');

const putRequestSchema = z.object({
  completed: z.boolean(),
});

export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/v1/subtask/[id]'>
) {
  let id = '';

  try {
    const params = await context.params;
    id = idSchema.parse(params.id);

    const body = await request.json();
    const { completed } = putRequestSchema.parse(body);

    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: {
        completed,
      },
    });

    return NextResponse.json(updatedSubtask, { status: 200 });
  } catch (error) {
    return handleApiError({
      error,
      model: 'Subtask',
      defaultMessage: `Failed to update the subtask with id: ${id}`,
    });
  }
}
