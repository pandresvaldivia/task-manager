import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import z from 'zod';

const postTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Task description is required'),
  statusId: z.uuidv4('Task status id must be a valid UUID'),
  boardId: z.uuidv4('Task board id must be a valid UUID'),
  subtasks: z
    .array(z.string().min(1, 'Subtask title must be a non-empty string'))
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      statusId,
      boardId,
      subtasks = [],
    } = postTaskSchema.parse(body);

    const subtasksList = subtasks.map((subtask) => {
      return {
        title: (subtask as string).trim(),
      };
    });

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
