# deepagents-interop

Interop layer for deepagents with Microsoft A2A/A2UI protocols.

## Overview

This package provides compatibility wrappers for the [deepagents](https://github.com/DavinciDreams/deepagentsjs) library to work with Microsoft's A2A (Agent-to-Agent) and A2UI (Agent-to-User Interface) protocols.

## Installation

```bash
npm install deepagents-interop
```

## Peer Dependencies

This package requires `deepagents@^1.6.0` as a peer dependency. You must install it in your project:

```bash
npm install deepagents deepagents-interop
```

## Usage

### A2A Protocol

```typescript
import { A2AWrapper } from "deepagents-interop/a2a";
import { createDeepAgent } from "deepagents";

// Create your agent
const agent = createDeepAgent({
  // ... your agent configuration
});

// Wrap with A2A protocol
const wrapper = new A2AWrapper({
  agent,
  sessionId: "session_123",
  threadId: "thread_456",
});

// Execute A2A request
const response = await wrapper.execute({
  messages: [
    { role: "user", content: "Hello, agent!" }
  ],
  config: {
    model: "gpt-4",
    temperature: 0.7,
  },
});
```

### A2UI Protocol

```typescript
import { A2UIWrapper } from "deepagents-interop/a2ui";

// Wrap with A2UI protocol
const wrapper = new A2UIWrapper({
  agent,
  sessionId: "session_123",
  threadId: "thread_456",
});

// Stream A2UI events
for await (const event of wrapper.stream([
  { role: "user", content: "Hello, agent!" }
])) {
  console.log(event);
  // Handle UI component updates
}
```

### Execution Tracking

```typescript
import { ExecutionTracker } from "deepagents-interop";

const tracker = ExecutionTracker.getInstance();

// Start tracking
const { id, abortController } = tracker.startExecution(
  "agent_123",
  "thread_456",
  request
);

// Complete execution
tracker.completeExecution(id);

// Cancel execution
tracker.cancelExecution(id);
```

### Agent Registry

```typescript
import { AgentRegistry } from "deepagents-interop";

const registry = AgentRegistry.getInstance();

// Register agent
registry.register("my-agent", agent);

// Get agent
const agent = registry.get("my-agent");

// List all agents
const agents = registry.list();
```

### Request Validation

```typescript
import { validateA2ARequest } from "deepagents-interop/a2a";

const result = validateA2ARequest(request);

if (result.valid) {
  // Use validated request
  console.log(result.data);
} else {
  // Handle validation errors
  console.error(result.errors);
}
```

## API Reference

### A2A Protocol

- [`A2AWrapper`](./src/a2a/wrapper.ts) - A2A protocol wrapper class
- [`validateA2ARequest()`](./src/a2a/validator.ts) - Request validation function
- [`A2ARequest`](./src/types.ts) - Request type
- [`A2AResponse`](./src/types.ts) - Response type

### A2UI Protocol

- [`A2UIWrapper`](./src/a2ui/wrapper.ts) - A2UI protocol wrapper class
- [`A2UIMessage`](./src/types/a2ui.ts) - Message type
- [`A2UIComponent`](./src/types/a2ui.ts) - Component type

### Utilities

- [`ExecutionTracker`](./src/utils/execution-tracker.ts) - Execution tracking singleton
- [`AgentRegistry`](./src/utils/agent-registry.ts) - Agent registry singleton

## License

MIT

## Repository

[https://github.com/DavinciDreams/deepagents-interop](https://github.com/DavinciDreams/deepagents-interop)
