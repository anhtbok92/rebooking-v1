import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

export class AppError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public code?: string,
		public details?: unknown
	) {
		super(message)
		this.name = "AppError"
	}
}

interface ErrorLog {
	timestamp: string
	error: string
	code?: string
	stack?: string
	details?: unknown
	path?: string
	method?: string
}

function logError(error: unknown, context?: { path?: string; method?: string }): void {
	const isDevelopment = process.env.NODE_ENV === "development"
	const errorLog: ErrorLog = {
		timestamp: new Date().toISOString(),
		error: error instanceof Error ? error.message : "Unknown error",
		...(error instanceof Error && isDevelopment && { stack: error.stack }),
		...(context && { ...context }),
	}

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		errorLog.code = error.code
		errorLog.details = error.meta
	} else if (error instanceof AppError) {
		errorLog.code = error.code
		errorLog.details = error.details
	} else if (error instanceof ZodError) {
		errorLog.details = error.errors
	}

	// In production, you might want to send this to a logging service
	console.error("[ERROR]", JSON.stringify(errorLog, null, 2))
}

export function handleError(error: unknown, context?: { path?: string; method?: string }): NextResponse {
	// Log the error
	logError(error, context)

	// Zod validation errors
	if (error instanceof ZodError) {
		return NextResponse.json(
			{
				error: "Validation failed",
				details: error.errors.map((err) => ({
					path: err.path.join("."),
					message: err.message,
				})),
			},
			{ status: 400 }
		)
	}

	// Prisma errors
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case "P2002":
				return NextResponse.json(
					{
						error: "A record with this value already exists",
						code: error.code,
					},
					{ status: 409 }
				)
			case "P2025":
				return NextResponse.json(
					{
						error: "Record not found",
						code: error.code,
					},
					{ status: 404 }
				)
			case "P2003":
				return NextResponse.json(
					{
						error: "Invalid reference",
						code: error.code,
					},
					{ status: 400 }
				)
			case "P2014":
				return NextResponse.json(
					{
						error: "Invalid ID provided",
						code: error.code,
					},
					{ status: 400 }
				)
			case "P2000":
				return NextResponse.json(
					{
						error: "Input value is too long",
						code: error.code,
					},
					{ status: 400 }
				)
			case "P2001":
				return NextResponse.json(
					{
						error: "Record does not exist",
						code: error.code,
					},
					{ status: 404 }
				)
			default:
				return NextResponse.json(
					{
						error: "Database error occurred",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}

	// Prisma validation errors
	if (error instanceof Prisma.PrismaClientValidationError) {
		return NextResponse.json(
			{
				error: "Invalid data provided",
			},
			{ status: 400 }
		)
	}

	// Custom AppError
	if (error instanceof AppError) {
		return NextResponse.json(
			{
				error: error.message,
				code: error.code,
				details: error.details,
			},
			{ status: error.statusCode }
		)
	}

	// Generic Error
	if (error instanceof Error) {
		// Don't expose internal error messages in production
		const isDevelopment = process.env.NODE_ENV === "development"
		
		// Check for common error types
		if (error.name === "TypeError" && error.message.includes("Cannot read")) {
			return NextResponse.json(
				{
					error: "Invalid request data",
				},
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{
				error: isDevelopment ? error.message : "An unexpected error occurred",
				...(isDevelopment && { stack: error.stack }),
			},
			{ status: 500 }
		)
	}

	// Unknown error
	return NextResponse.json(
		{
			error: "An unexpected error occurred",
		},
		{ status: 500 }
	)
}

export async function withErrorHandling<T>(
	handler: () => Promise<T>,
	context?: { path?: string; method?: string }
): Promise<NextResponse> {
	try {
		const result = await handler()
		return result instanceof NextResponse ? result : NextResponse.json(result)
	} catch (error) {
		return handleError(error, context)
	}
}

