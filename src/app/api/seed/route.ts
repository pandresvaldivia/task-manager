import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reset = searchParams.get('reset') === 'true';

  try {
    if (reset) {
      await prisma.board.deleteMany();
    }

    // Create Board 1
    const marketingBoard = await prisma.board.create({
      data: {
        name: 'Marketing Campaign',
        statuses: {
          create: [{ name: 'Todo' }, { name: 'In Progress' }, { name: 'Done' }],
        },
      },
    });

    const marketingStatuses = await prisma.status.findMany({
      where: { boardId: marketingBoard.id },
    });

    const marketingTodo = marketingStatuses.find((s) => s.name === 'Todo');
    const marketingInProgress = marketingStatuses.find(
      (s) => s.name === 'In Progress',
    );
    const marketingDone = marketingStatuses.find((s) => s.name === 'Done');

    if (!marketingTodo || !marketingInProgress || !marketingDone) {
      throw new Error('Marketing statuses not found');
    }

    await prisma.task.create({
      data: {
        title: 'Create social media strategy',
        description: 'Develop a comprehensive social media strategy for Q1',
        boardId: marketingBoard.id,
        statusId: marketingTodo.id,
        subtasks: {
          create: [
            { title: 'Research competitor strategies', completed: false },
            { title: 'Define target audience', completed: false },
            { title: 'Create content calendar', completed: false },
          ],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: 'Design promotional materials',
        description:
          'Create banners, flyers, and digital assets for the campaign',
        boardId: marketingBoard.id,
        statusId: marketingInProgress.id,
        subtasks: {
          create: [
            { title: 'Design Instagram posts', completed: true },
            { title: 'Create Facebook banners', completed: true },
            { title: 'Design email templates', completed: false },
          ],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: 'Launch email campaign',
        description: 'Send out newsletter to subscriber list',
        boardId: marketingBoard.id,
        statusId: marketingDone.id,
        subtasks: {
          create: [
            { title: 'Write email copy', completed: true },
            { title: 'Test email rendering', completed: true },
            { title: 'Send to subscribers', completed: true },
          ],
        },
      },
    });

    // Create Board 2
    const webDevBoard = await prisma.board.create({
      data: {
        name: 'Web Development',
        statuses: {
          create: [
            { name: 'Backlog' },
            { name: 'In Development' },
            { name: 'Testing' },
            { name: 'Completed' },
          ],
        },
      },
    });

    const webDevStatuses = await prisma.status.findMany({
      where: { boardId: webDevBoard.id },
    });

    const webDevBacklog = webDevStatuses.find((s) => s.name === 'Backlog');
    const webDevInDev = webDevStatuses.find((s) => s.name === 'In Development');
    const webDevTesting = webDevStatuses.find((s) => s.name === 'Testing');
    const webDevCompleted = webDevStatuses.find((s) => s.name === 'Completed');

    if (!webDevBacklog || !webDevInDev || !webDevTesting || !webDevCompleted) {
      throw new Error('Web Development statuses not found');
    }

    await prisma.task.create({
      data: {
        title: 'Implement user authentication',
        description: 'Add login, signup, and password reset functionality',
        boardId: webDevBoard.id,
        statusId: webDevBacklog.id,
        subtasks: {
          create: [
            { title: 'Set up authentication provider', completed: false },
            { title: 'Create login page', completed: false },
            { title: 'Create signup page', completed: false },
            { title: 'Implement password reset', completed: false },
          ],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: 'Build dashboard UI',
        description: 'Create the main dashboard with charts and statistics',
        boardId: webDevBoard.id,
        statusId: webDevInDev.id,
        subtasks: {
          create: [
            { title: 'Design dashboard layout', completed: true },
            { title: 'Implement charts with Chart.js', completed: true },
            { title: 'Add responsive design', completed: false },
            { title: 'Connect to API', completed: false },
          ],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: 'API integration for user profiles',
        description:
          'Connect frontend to backend API for user profile management',
        boardId: webDevBoard.id,
        statusId: webDevTesting.id,
        subtasks: {
          create: [
            { title: 'Create API endpoints', completed: true },
            { title: 'Implement frontend calls', completed: true },
            { title: 'Add error handling', completed: true },
            { title: 'Write unit tests', completed: false },
          ],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        boardId: webDevBoard.id,
        statusId: webDevCompleted.id,
        subtasks: {
          create: [
            { title: 'Configure GitHub Actions', completed: true },
            { title: 'Set up automated tests', completed: true },
            { title: 'Configure deployment to Vercel', completed: true },
          ],
        },
      },
    });

    return NextResponse.json({
      message: 'Seed executed successfully',
      data: {
        boards: 2,
        statuses: 7,
        tasks: 7,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        message: 'Seed execution failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
