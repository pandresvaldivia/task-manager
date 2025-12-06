import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/v1/move-tasks/[id]'>
) {
  try {
    const { id } = await context.params;
    const { statusId } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
    }

    if (!statusId) {
      return NextResponse.json({ error: 'Missing statusId' }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const status = await prisma.status.findUnique({
      where: {
        id: statusId,
      },
    });

    if (!status) {
      return NextResponse.json({ error: 'Status not found' }, { status: 404 });
    }

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
