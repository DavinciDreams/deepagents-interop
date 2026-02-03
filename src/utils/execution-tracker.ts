/**
 * Execution Tracker for monitoring agent execution
 */
export class ExecutionTracker {
  private static instance: ExecutionTracker;
  private executions = new Map<string, {
    id: string;
    agentId: string;
    threadId: string;
    checkpointId?: string;
    startTime: Date;
    startedAt: Date;
    completedAt?: Date;
    status: 'running' | 'completed' | 'error' | 'cancelled';
    result?: unknown;
    error?: Error;
    progress?: number;
    abortController?: AbortController;
  }>();

  private constructor() {}

  static getInstance(): ExecutionTracker {
    if (!ExecutionTracker.instance) {
      ExecutionTracker.instance = new ExecutionTracker();
    }
    return ExecutionTracker.instance;
  }

  start(executionId: string) {
    const now = new Date();
    this.executions.set(executionId, {
      id: executionId,
      agentId: '',
      threadId: '',
      startTime: now,
      startedAt: now,
      status: 'running',
    });
  }

  startExecution(agentId: string, threadId: string, request: unknown) {
    const executionId = `${agentId}_${threadId}_${Date.now()}`;
    const now = new Date();
    const abortController = new AbortController();
    this.executions.set(executionId, {
      id: executionId,
      agentId,
      threadId,
      startTime: now,
      startedAt: now,
      status: 'running',
      abortController,
    });
    return { id: executionId, abortController };
  }

  complete(executionId: string, result: unknown) {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'completed';
      execution.result = result;
    }
  }

  completeExecution(executionId: string) {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'completed';
      execution.completedAt = new Date();
    }
  }

  error(executionId: string, error: Error) {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'error';
      execution.error = error;
    }
  }

  failExecution(executionId: string, error: Error | string) {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'error';
      execution.error = typeof error === 'string' ? new Error(error) : error;
    }
  }

  cancelExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'cancelled';
      execution.abortController?.abort();
      return true;
    }
    return false;
  }

  getExecution(executionId: string) {
    return this.executions.get(executionId);
  }

  getExecutionByThread(threadId: string) {
    for (const execution of this.executions.values()) {
      if (execution.threadId === threadId) {
        return execution;
      }
    }
    return undefined;
  }

  getExecutionByCheckpoint(checkpointId: string) {
    for (const execution of this.executions.values()) {
      if (execution.checkpointId === checkpointId) {
        return execution;
      }
    }
    return undefined;
  }

  getStatus(executionId: string) {
    return this.executions.get(executionId);
  }
}
