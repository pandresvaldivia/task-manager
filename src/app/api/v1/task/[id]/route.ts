import { Prisma } from '@/generated/prisma/client';
import { SubtaskScalarWhereInput } from '@/generated/prisma/models';
import prisma from '@/lib/prisma';
import { isValidString } from '@/modules/shared/helpers/string';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  context: RouteContext<'/api/v1/tasks/[id]'>
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
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

export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/v1/tasks/[id]'>
) {
  const { id } = await context.params;
  const { statusId, subtasks = [], description, title } = await request.json();

  if (!isValidString(id)) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
  }

  if (title && !isValidString(title)) {
    return NextResponse.json(
      {
        error: 'Task title must be a non-empty string',
      },
      {
        status: 400,
      }
    );
  }

  if (description && !isValidString(description)) {
    return NextResponse.json(
      {
        error: 'Task description must be a non-empty string',
      },
      {
        status: 400,
      }
    );
  }

  if (statusId && !isValidString(statusId)) {
    return NextResponse.json(
      {
        error: 'statusId must be a non-empty string',
      },
      {
        status: 400,
      }
    );
  }

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
    if (!isValidString(subtask.title)) {
      return NextResponse.json(
        {
          error: 'All subtasks must have a title',
        },
        {
          status: 400,
        }
      );
    }

    if (subtask.id) {
      existingIds.push({ id: subtask.id });
    }

    subtasksList.push({
      id: subtask.id,
      title: subtask.title.trim(),
    });
  }

  console.log({ subtasksList });

  try {
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
      { error: ` Failed to update task with id: ${id}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<'/api/v1/tasks/[id]'>
) {
  const { id } = await context.params;

  if (!isValidString(id)) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
  }

  try {
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
