import { Prisma } from '@/generated/prisma/client';
import { SubtaskScalarWhereInput } from '@/generated/prisma/models';
import prisma from '@/lib/prisma';
import { isValidString } from '@/modules/shared/helpers/string';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

type TaskRoute = '/api/v1/task/[id]';

const idSchema = z.uuidv4('Invalid ID format');

export async function GET(
  _request: NextRequest,
  context: RouteContext<TaskRoute>
) {
  let id = '';

  try {
    const params = await context.params;
    id = idSchema.parse(params.id);

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          error: 'Task not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        data: task,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            message: issue.message,
          })),
        },
        {
          status: 400,
        }
      );
    }

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
      { error: `Failed to get the task with id: ${id}` },
      { status: 500 }
    );
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
  let id = '';

  try {
    const params = await context.params;
    id = idSchema.parse(params.id);

    const body = await request.json();

    const {
      statusId,
      subtasks = [],
      description,
      title,
    } = putTaskSchema.parse(body);

    if (subtasks && !Array.isArray(subtasks)) {
      return NextResponse.json(
        {
          error: 'Subtaks must be a valid JSON array',
        },
        {
          status: 400,
        }
      );
    }

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        {
          status: 400,
        }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            error: 'Task not found',
          },
          { status: 404 }
        );
      }

      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'The provided statusId does not exist',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: ` Failed to update task with id: ${id}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<TaskRoute>
) {
  let id = '';

  try {
    const params = await context.params;
    id = idSchema.parse(params.id);

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            message: issue.message,
          })),
        },
        {
          status: 400,
        }
      );
    }

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
      { error: ` Failed to delete task with id: ${id}` },
      { status: 500 }
    );
  }
}
