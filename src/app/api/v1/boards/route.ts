import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const boards = await prisma.board.findMany();

    return NextResponse.json(
      {
        data: boards,
      },
      {
        status: 200,
      },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to fetch boards",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const { name, statuses = [] } = await request.json();

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json(
      {
        error: "Board name is required",
      },
      {
        status: 400,
      },
    );
  }

  if (statuses && !Array.isArray(statuses)) {
    return NextResponse.json(
      {
        error: "Statuses must be a valid JSON array",
      },
      {
        status: 400,
      },
    );
  }

  const statusesList = statuses.map((status: unknown) => {
    if (typeof status !== "string" || status.trim() === "") {
      return NextResponse.json(
        {
          error: "All statuses must be non-empty strings",
        },
        {
          status: 400,
        },
      );
    }

    return {
      name: status.trim(),
    };
  });

  try {
    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        statuses: {
          createMany: {
            data: statusesList,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: board,
      },
      {
        status: 201,
      },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to create board",
      },
      {
        status: 500,
      },
    );
  }
}
