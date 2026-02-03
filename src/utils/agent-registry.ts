import type { DeepAgent, DefaultDeepAgentTypeConfig } from "deepagents";

/**
 * Agent Registry for managing multiple agents
 */
export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents = new Map<string, DeepAgent<DefaultDeepAgentTypeConfig>>();

  private constructor() {}

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  register(id: string, agent: DeepAgent<DefaultDeepAgentTypeConfig>) {
    this.agents.set(id, agent);
  }

  get(id: string) {
    return this.agents.get(id);
  }

  getAgent(id: string) {
    return this.agents.get(id);
  }

  list() {
    return Array.from(this.agents.entries());
  }
}
