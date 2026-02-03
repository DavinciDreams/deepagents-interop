/**
 * A2UI (Agent-to-User Interface) Types
 * 
 * This module defines types for the A2UI protocol.
 */

/**
 * A2UI Message Types
 */
export enum A2UIMessageType {
  TEXT = "text",
  MARKDOWN = "markdown",
  CODE = "code",
  IMAGE = "image",
  TOOL_CALL = "tool_call",
  TOOL_RESULT = "tool_result",
  ERROR = "error",
  STATUS = "status",
}

/**
 * A2UI Message
 */
export interface A2UIMessage {
  type: A2UIMessageType;
  id: string;
  timestamp: string;
  content: string | Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * A2UI Component Types
 */
export enum A2UIComponentType {
  CARD = "card",
  LIST = "list",
  TABLE = "table",
  CHART = "chart",
  FORM = "form",
  MODAL = "modal",
  ALERT = "alert",
}

/**
 * A2UI Component
 */
export interface A2UIComponent {
  type: A2UIComponentType;
  id: string;
  props: Record<string, unknown>;
  children?: A2UIComponent[];
}

/**
 * A2UI Stream Event
 */
export interface A2UIStreamEvent {
  type: 'message' | 'component' | 'status' | 'error';
  data: A2UIMessage | A2UIComponent | { status: string } | { error: string };
  timestamp: string;
}
