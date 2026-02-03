/**
 * A2UI (Agent-to-User Interface) Wrapper
 *
 * This module provides a wrapper for the A2UI protocol
 * that wraps LangChain agents for UI streaming.
 */

import type { ReactAgent } from "langchain";
import type { A2UIMessage, A2UIStreamEvent } from "../types/a2ui";
import { A2UIMessageType } from "../types/a2ui";

/**
 * A2UI Wrapper Options
 */
export interface A2UIWrapperOptions {
  agent: ReactAgent;
  sessionId?: string;
  threadId?: string;
}

/**
 * A2UI Wrapper
 * 
 * Wraps a LangChain agent to provide A2UI protocol compatibility.
 */
export class A2UIWrapper {
  private agent: ReactAgent;
  private sessionId: string;
  private threadId: string;

  constructor(options: A2UIWrapperOptions) {
    this.agent = options.agent;
    this.sessionId = options.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.threadId = options.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Execute an agent request with A2UI streaming
   */
  async *stream(messages: Array<{ role: string; content: string }>): AsyncGenerator<A2UIStreamEvent> {
    try {
      // Execute the agent with streaming
      const stream = await this.agent.stream({
        messages: messages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
      });

      for await (const chunk of stream) {
        // Emit message events for each chunk
        const content = typeof chunk === 'string' ? chunk :
                      typeof chunk.content === 'string' ? chunk.content :
                      JSON.stringify(chunk);
        
        if (content) {
          const message: A2UIMessage = {
            type: A2UIMessageType.MARKDOWN,
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            timestamp: new Date().toISOString(),
            content,
          };

          yield {
            type: 'message',
            data: message,
            timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      // Emit error event
      yield {
        type: 'error',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get the session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get the thread ID
   */
  getThreadId(): string {
    return this.threadId;
  }
}
