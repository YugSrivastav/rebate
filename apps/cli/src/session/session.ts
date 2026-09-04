/**
 * Session Manager for Rebate CLI
 * Manages local session identity, persistent configuration, and wait duration.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { AgentType } from '@rebate/shared';

export interface RebateConfig {
  developerId: string;
  apiUrl: string;
  preferredAgent: AgentType;
  minimumViewSeconds: number;
}

const CONFIG_DIR = path.join(os.homedir(), '.rebate');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: RebateConfig = {
  developerId: 'dev_alex_india',
  apiUrl: 'http://localhost:3000',
  preferredAgent: 'antigravity',
  minimumViewSeconds: 8,
};

export class SessionManager {
  private config: RebateConfig;
  private currentSessionId: string;

  constructor() {
    this.config = this.loadConfig();
    this.currentSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }

  private loadConfig(): RebateConfig {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  }

  public saveConfig(newConfig: Partial<RebateConfig>): void {
    this.config = { ...this.config, ...newConfig };
    try {
      if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SessionManager] Could not save config:', err);
    }
  }

  public getConfig(): RebateConfig {
    return this.config;
  }

  public getSessionId(): string {
    return this.currentSessionId;
  }

  public resetSession(): string {
    this.currentSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return this.currentSessionId;
  }
}
