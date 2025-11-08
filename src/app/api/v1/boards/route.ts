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
