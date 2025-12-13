import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import z from 'zod';

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
            error:
              'Some of the provided ids are invalid. Please check the task and status ids.',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
