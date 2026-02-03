/**
 * Deep Agents Interop Layer
 *
 * This module provides compatibility wrappers for the deepagents library
 * to work with the Microsoft A2A (Agent-to-Agent) protocol.
 */

import { createDeepAgent, type CreateDeepAgentParams, type DeepAgent, type DeepAgentTypeConfig, type DefaultDeepAgentTypeConfig } from "deepagents";
import type { ReactAgent, AgentMiddleware } from "langchain";
import { BaseLanguageModel } from "@langchain/core/language_models/base";

// Re-export deepagents types
export type { CreateDeepAgentParams, DeepAgent, DeepAgentTypeConfig, DefaultDeepAgentTypeConfig } from "deepagents";
export { createDeepAgent } from "deepagents";

// Re-export common langchain types
export type { ReactAgent, AgentMiddleware } from "langchain";
export type { BaseLanguageModel } from "@langchain/core/language_models/base";

// Re-export utility classes
export { ExecutionTracker, AgentRegistry } from "./utils";

// Re-export A2A module
export { A2AWrapper, validateA2ARequest } from "./a2a";
export type { A2AWrapperOptions } from "./a2a/wrapper";
export type { ValidationResult } from "./a2a/validator";

// Re-export A2UI module
export { A2UIWrapper } from "./a2ui";
export type { A2UIWrapperOptions } from "./a2ui/wrapper";

// Re-export types
export type {
  A2ARequest,
  A2AResponse,
  A2AErrorCode,
  A2AStreamEventType,
  A2AStreamEvent,
  A2AErrorResponse
} from "./types";

export type {
  A2UIMessageType,
  A2UIMessage,
  A2UIComponentType,
  A2UIComponent,
  A2UIStreamEvent
} from "./types/a2ui";
