export * from "./schemas"

import { ZodError, ZodTypeAny, z } from "zod"
import { NextResponse } from "next/server"

export function validateRequest<T extends z.ZodTypeAny>(
	schema: T,
	data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: ZodError } {
	const result = schema.safeParse(data)
	if (result.success) {
		return { success: true, data: result.data as z.infer<T> }
	}
	return { success: false, error: result.error }
}

export function validationErrorResponse(error: ZodError) {
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

