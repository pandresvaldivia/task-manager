import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.status.deleteMany();
  await prisma.board.deleteMany();

  // Create a marketing board
  const marketingBoard = await prisma.board.create({
    data: {
      name: 'Marketing Campaign :o',
    },
  });

  const todoStatus = await prisma.status.create({
    data: {
      name: 'Todo',
      board: { connect: { id: marketingBoard.id } },
    },
  });

  const inProgressStatus = await prisma.status.create({
    data: {
      name: 'In Progress',
      board: { connect: { id: marketingBoard.id } },
    },
  });

  const doneStatus = await prisma.status.create({
    data: {
      name: 'Done',
      board: { connect: { id: marketingBoard.id } },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Create social media strategy',
      description: 'Develop a comprehensive social media strategy for Q1',
      board: { connect: { id: marketingBoard.id } },
      status: { connect: { id: todoStatus.id } },
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
      board: { connect: { id: marketingBoard.id } },
      status: { connect: { id: inProgressStatus.id } },
      subtasks: {
        create: [
          { title: 'Design Instagram posts', completed: true },
          { title: 'Design email templates', completed: false },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Launch email campaign',
      description: 'Send out newsletter to subscriber list',
      board: { connect: { id: marketingBoard.id } },
      status: { connect: { id: doneStatus.id } },
      subtasks: {
        create: [
          { title: 'Write email copy', completed: true },
          { title: 'Test email rendering', completed: true },
          { title: 'Send to subscribers', completed: true },
        ],
      },
    },
  });

  // Create a development board
  const developmentBoard = await prisma.board.create({
    data: {
      name: 'Web development',
    },
  });

  const backlogStatus = await prisma.status.create({
    data: {
      name: 'Backlog',
      board: { connect: { id: developmentBoard.id } },
    },
  });

  const inDevelopmentStatus = await prisma.status.create({
    data: {
      name: 'In development',
      board: { connect: { id: developmentBoard.id } },
    },
  });

  const testingStatus = await prisma.status.create({
    data: {
      name: 'Testing',
      board: { connect: { id: developmentBoard.id } },
    },
  });

  const completedStatus = await prisma.status.create({
    data: {
      name: 'Completed',
      board: { connect: { id: developmentBoard.id } },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement user authentication',
      description: 'Add login, signup, and password reset functionality',
      board: { connect: { id: developmentBoard.id } },
      status: { connect: { id: backlogStatus.id } },
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
      board: { connect: { id: developmentBoard.id } },
      status: { connect: { id: inDevelopmentStatus.id } },
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
      board: { connect: { id: developmentBoard.id } },
      status: { connect: { id: testingStatus.id } },
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
      board: { connect: { id: developmentBoard.id } },
      status: { connect: { id: completedStatus.id } },
      subtasks: {
        create: [
          { title: 'Configure GitHub Actions', completed: true },
          { title: 'Set up automated tests', completed: true },
          { title: 'Configure deployment to Vercel', completed: true },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
