import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import z from 'zod';
impor'@/modules/shared/infrastructure/next/helpers/api-error-handler';

const postTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Task description is required'),
  statusId: z.uuidv4('Task status id must be a valid UUID'),
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
    return handleApiError({
      error,
      model: 'Task',
      defaultMessage: 'Failed to create task',
    });
  }
}
