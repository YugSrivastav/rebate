/**
 * Terminal Display for Rebate
 * Renders non-intrusive 1-line thinking state with sponsored opportunity.
 * HARD RULE: Never reveals reward amounts in the CLI status line.
 */

import { exec } from 'child_process';
import { Opportunity } from '@rebate/shared';

// ANSI terminal colors and cursor control
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const EMERALD = '\x1b[32m';
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export class TerminalDisplay {
  private activeOpportunity: Opportunity | null = null;
  private spinnerIndex = 0;
  private spinnerTimer?: NodeJS.Timeout;
  private isThinking = false;
  private currentStatus = 'AI is thinking...';

  public startThinking(opportunity?: Opportunity | null): void {
    this.isThinking = true;
    this.activeOpportunity = opportunity || null;
    this.spinnerIndex = 0;

    if (this.spinnerTimer) clearInterval(this.spinnerTimer);

    this.render();
    this.spinnerTimer = setInterval(() => {
      this.spinnerIndex = (this.spinnerIndex + 1) % SPINNER_FRAMES.length;
      this.render();
    }, 120);
  }

  public updateOpportunity(opportunity: Opportunity | null): void {
    this.activeOpportunity = opportunity;
    this.render();
  }

  public stopThinking(finalMessage?: string): void {
    if (this.spinnerTimer) {
      clearInterval(this.spinnerTimer);
      this.spinnerTimer = undefined;
    }
    this.isThinking = false;
    this.activeOpportunity = null;

    // Clear line and return to clean terminal state
    process.stdout.write('\r\x1b[K');
    if (finalMessage) {
      process.stdout.write(`${finalMessage}\n`);
    }
  }

  private render(): void {
    if (!this.isThinking) return;

    const frame = SPINNER_FRAMES[this.spinnerIndex];

    if (!this.activeOpportunity) {
      // Normal subtle thinking line
      process.stdout.write(`\r\x1b[K${CYAN}${frame}${RESET} ${DIM}AI is thinking...${RESET}`);
      return;
    }

    // Concise, native sponsored status line (Section 2 & 3)
    // AI is thinking... • Sponsored: [Title] — [CTA]
    const cta = this.activeOpportunity.cta || 'Apply';
    const title = this.activeOpportunity.title;

    const line =
      `\r\x1b[K${CYAN}${frame}${RESET} ${DIM}AI is thinking...${RESET} ${DIM}•${RESET} ` +
      `${DIM}Sponsored:${RESET} ${BOLD}${title}${RESET} ${DIM}—${RESET} ` +
      `${EMERALD}${cta}${RESET} ${DIM}[press o to view]${RESET}`;

    process.stdout.write(line);
  }

  public openInBrowser(url: string): void {
    const cmd =
      process.platform === 'win32'
        ? `start "" "${url}"`
        : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;

    exec(cmd, (err) => {
      if (err) {
        console.error('\n[Rebate] Failed to launch browser automatically. URL:', url);
      }
    });
  }

  public getActiveOpportunity(): Opportunity | null {
    return this.activeOpportunity;
  }
}
