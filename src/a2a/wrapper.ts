/**
 * A2A Protocol Wrapper
 * 
 * This module provides a wrapper for the A2A (Agent-to-Agent) protocol
 * that wraps LangChain agents for compatibility with Microsoft's A2A protocol.
 */

import type { ReactAgent } from "langchain";
import type { A2ARequest, A2AResponse, A2AErrorCode } from "../types";
import { A2AStreamEventType } from "../types";

/**
 * A2A Wrapper Options
 */
export interface A2AWrapperOptions {
  agent: ReactAgent | undefined;
  sessionId?: string;
  threadId?: string;
  config?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

/**
 * A2A Wrapper
 * 
 * Wraps a LangChain agent to provide A2A protocol compatibility.
 */
export class A2AWrapper {
  private agent: ReactAgent | undefined;
  private sessionId: string;
  private threadId: string;
  private config: A2AWrapperOptions['config'];

  constructor(options: A2AWrapperOptions) {
    this.agent = options.agent;
    this.sessionId = options.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.threadId = options.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.config = options.config;
  }

  /**
   * Execute an A2A request
   */
  async execute(request: A2ARequest): Promise<A2AResponse> {
    if (!this.agent) {
      return {
        sessionId: this.sessionId,
        threadId: this.threadId,
        messages: [],
        status: 'error',
        error: {
          code: 'AGENT_NOT_FOUND' as A2AErrorCode,
          message: 'Agent not found',
        },
      };
    }

    try {
      // Execute the agent with the request
      const result = await this.agent.invoke({
        messages: request.messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        config: this.config,
      } as any);

      return {
        sessionId: this.sessionId,
        threadId: this.threadId,
        messages: [
          {
            role: 'assistant',
            content: typeof result === 'string' ? result : (result as any)?.content || '',
            timestamp: new Date().toISOString(),
          },
        ],
        status: 'success',
        metadata: {
          model: this.config?.model,
          executionTime: Date.now(),
        },
      };
    } catch (error) {
      return {
        sessionId: this.sessionId,
        threadId: this.threadId,
        messages: [],
        status: 'error',
        error: {
          code: 'EXECUTION_ERROR' as A2AErrorCode,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Execute an A2A request with streaming
   */
  async *stream(request: A2ARequest): AsyncGenerator<any> {
    if (!this.agent) {
      yield {
        type: A2AStreamEventType.ERROR,
        sessionId: this.sessionId,
        threadId: this.threadId,
        timestamp: new Date().toISOString(),
        data: {
          error: 'Agent not found',
        },
      };
      return;
    }

    try {
      // Emit start event
      yield {
        type: A2AStreamEventType.START,
        sessionId: this.sessionId,
        threadId: this.threadId,
        timestamp: new Date().toISOString(),
        data: { messages: request.messages },
      };

      // Execute the agent with streaming
      const stream = await this.agent.stream({
        messages: request.messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        config: this.config,
      } as any);

      for await (const chunk of stream) {
        // Emit message events for each chunk
        const content = typeof chunk === 'string' ? chunk : 
                      typeof chunk?.content === 'string' ? chunk.content :
                      JSON.stringify(chunk);
        
        if (content) {
          yield {
            type: A2AStreamEventType.MESSAGE,
            sessionId: this.sessionId,
            threadId: this.threadId,
            timestamp: new Date().toISOString(),
            data: { content },
          };
        }
      }

      // Emit end event
      yield {
        type: A2AStreamEventType.END,
        sessionId: this.sessionId,
        threadId: this.threadId,
        timestamp: new Date().toISOString(),
        data: {},
      };
    } catch (error) {
      // Emit error event
      yield {
        type: A2AStreamEventType.ERROR,
        sessionId: this.sessionId,
        threadId: this.threadId,
        timestamp: new Date().toISOString(),
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
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
