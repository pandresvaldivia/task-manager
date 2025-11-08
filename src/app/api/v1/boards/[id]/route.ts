import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/v1/boards/[id]">,
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        statuses: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: board,
      },
      {
        status: 200,
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch board" },
      { status: 500 },
    );
  }
}
