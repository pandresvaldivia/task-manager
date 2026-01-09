import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import z from 'zod';
import { ApiValidationError } from '../interfaces/api';

export function handleApiError({
  error,
  model,
  defaultMessage = 'An unexpected error occurred',
}: {
  error: unknown;
  model?: string;
  defaultMessage?: string;
}) {
  if (error instanceof Error) {
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        {
          error: 'Invalid JSON format in request body',
        },
        {
          status: 400,
        }
      );
    }
  }

  if (error instanceof z.ZodError) {
    return formatApiValidationError({ error });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return formatApiErrorCode({ code: error.code, model });
  }

  return NextResponse.json({ error: defaultMessage }, { status: 500 });
}

/**
 * Formats validation errors into a standardized API response.
 * @param options.error The validation error object containing issues details.
 * @param options.message Optional custom error message.
 * @returns A NextResponse object with formatted validation errors.
 */
function formatApiValidationError({
  error,
  message,
}: {
  error: ApiValidationError;
  message?: string;
}) {
  return NextResponse.json(
    {
      error: message ?? 'Invalid request data',
      details: error.issues.map((issue) => ({
        message: issue.message,
      })),
    },
    {
      status: 400,
    }
  );
}

/**
 * Maps error codes to standardized API error responses.
 * @param options.code The error code.
 * @param options.model Optional model name related to the error.
 * @returns A NextResponse object with formatted error message.
 */
function formatApiErrorCode({ code, model }: { code: string; model?: string }) {
  if (code === 'P2025') {
    return NextResponse.json(
      {
        error: model ? `${model} not found` : 'Resource not found',
      },
      { status: 404 }
    );
  }

  if (code === 'P2003') {
    return NextResponse.json(
      {
        error:
          'Some of the provided ids are invalid. Please check the related resource ids.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
