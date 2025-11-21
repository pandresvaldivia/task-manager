import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const {
    title,
    description,
    subtasks = [],
    statusId,
    boardId,
  } = await request.json();

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      {
        error: "Task title is required",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return NextResponse.json(
      {
        error: "Task description is required",
      },
      {
        status: 400,
      },
    );
  }

  if (!statusId || typeof statusId !== "string") {
    return NextResponse.json(
      {
        error: "Task status id is required",
      },
      {
        status: 400,
      },
    );
  }

  if (subtasks && !Array.isArray(subtasks)) {
    return NextResponse.json(
      {
        error: "Task subtasks must be a valid array",
      },
      {
        status: 400,
      },
    );
  }

  const subtasksList = subtasks.map((subtask: unknown) => {
    if (typeof subtask !== "string" || subtask.trim() === "") {
      return NextResponse.json(
        {
          error: "All subtasks must be non-empty strings",
        },
        {
          status: 400,
        },
      );
    }

    return {
      title: subtask.trim(),
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
      },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to create task",
      },
      {
        status: 500,
      },
    );
  }
}
