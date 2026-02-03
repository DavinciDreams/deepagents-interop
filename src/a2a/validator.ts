/**
 * A2A Request Validator
 * 
 * This module provides validation for A2A protocol requests.
 */

import { z } from "zod";
import type { A2ARequest } from "../types";

/**
 * A2A Message Schema
 */
const A2AMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().optional(),
});

/**
 * A2A Request Config Schema
 */
const A2ARequestConfigSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  stream: z.boolean().optional(),
}).optional();

/**
 * A2A Request Schema
 */
export const A2ARequestSchema = z.object({
  sessionId: z.string().optional(),
  threadId: z.string().optional(),
  messages: z.array(A2AMessageSchema).min(1),
  context: z.record(z.string(), z.unknown()).optional(),
  config: A2ARequestConfigSchema,
});

/**
 * Validation Result
 */
export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Validate A2A Request
 */
export function validateA2ARequest(request: unknown): ValidationResult<A2ARequest> {
  try {
    const validated = A2ARequestSchema.parse(request);
    return {
      valid: true,
      data: validated as A2ARequest,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((err) => `${err.path.join(".")}: ${err.message}`),
      };
    }
    return {
      valid: false,
      errors: ["Unknown validation error"],
    };
  }
}
