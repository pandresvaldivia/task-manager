import { SubtaskScalarWhereInput } from '@/generated/prisma/models';
import prisma from '@/lib/prisma';
import { handleApiError } from '@/modules/shared/infrastructure/next/helpers/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

type TaskRoute = '/api/v1/task/[id]';

const idSchema = z.uuidv4('Invalid ID format');

export async function GET(
  _request: NextRequest,
  context: RouteContext<TaskRoute>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
      },
    });

    return NextResponse.json(
      {
        data: task,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError({
      error,
      model: 'Task',
      defaultMessage: 'Failed to get the task',
    });
  }
}

const putTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  statusId: z.uuidv4('Invalid statusId format'),
  subtasks: z
    .array(
      z.object({
        id: z.uuidv4('Invalid subtask ID format').optional(),
        title: z.string().min(1, 'Subtask title cannot be empty'),
      })
    )
    .optional(),
});

export async function PUT(
  request: NextRequest,
  context: RouteContext<TaskRoute>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

    const body = await request.json();

    const {
      statusId,
      subtasks = [],
      description,
      title,
    } = putTaskSchema.parse(body);

    const subtasksList: { id?: string; title: string }[] = [];
    const existingIds: SubtaskScalarWhereInput[] = [];

    for (const subtask of subtasks) {
      if (subtask.id) {
        existingIds.push({ id: subtask.id });
      }

      subtasksList.push({
        id: subtask.id,
        title: subtask.title.trim(),
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        statusId,
        subtasks: {
          deleteMany: {
            taskId: id,
            NOT: existingIds,
          },
          upsert: subtasksList.map((subtask) => ({
            where: { id: subtask.id ?? '' },
            create: { title: subtask.title },
            update: { title: subtask.title },
          })),
        },
      },
    });

    return NextResponse.json(
      {
        data: updatedTask,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError({
      error,
      model: 'Task',
      defaultMessage: 'Failed to update task',
    });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<TaskRoute>
) {
  try {
    const params = await context.params;
    const id = idSchema.parse(params.id);

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
    return handleApiError({
      error,
      model: 'Task',
      defaultMessage: 'Failed to delete task with',
    });
  }
}
