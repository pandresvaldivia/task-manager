import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidString } from '@/modules/shared/helpers/string';
import { Prisma } from '@/generated/prisma/client';

export async function POST(request: Request) {
  const {
    title,
    description,
    subtasks = [],
    statusId,
    boardId,
  } = await request.json();

  if (!isValidString(title)) {
    return NextResponse.json(
      {
        error: 'Task title is required',
      },
      {
        status: 400,
      }
    );
  }

  if (!isValidString(description)) {
    return NextResponse.json(
      {
        error: 'Task description is required',
      },
      {
        status: 400,
      }
    );
  }

  if (!isValidString(statusId)) {
    return NextResponse.json(
      {
        error: 'Task status id is required',
      },
      {
        status: 400,
      }
    );
  }

  if (subtasks && !Array.isArray(subtasks)) {
    return NextResponse.json(
      {
        error: 'Task subtasks must be a valid array',
      },
      {
        status: 400,
      }
    );
  }

  const subtasksList = subtasks.map((subtask: unknown) => {
    if (!isValidString(subtask)) {
      return NextResponse.json(
        {
          error: 'All subtasks must be non-empty strings',
        },
        {
          status: 400,
        }
      );
    }

    return {
      title: (subtask as string).trim(),
    };
  });

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        statusId,
        boardId,
        subtasks: {
          createMany: {
            data: subtasksList,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: { ...task, subtasks: subtasksList },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'The provided statusId or boardId does not exist',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to create task',
      },
      {
        status: 500,
      }
    );
  }
}
