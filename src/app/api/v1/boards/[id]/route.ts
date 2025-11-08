import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/v1/boards/[id]">,
) {
  const { id } = await context.params;

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

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

  return NextResponse.json(
    {
      data: board,
    },
    {
      status: 200,
    },
  );
}
