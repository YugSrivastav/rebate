"""
Rebate Antigravity Proxy
Transparently wraps Google Antigravity CLI (agy).
Intercepts wait-states ('Generating...') and renders matched developer opportunities.
"""

import sys
import os
import time
import json
import urllib.request
import threading
import webbrowser

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

try:
    import msvcrt
    from winpty import PtyProcess
except ImportError as e:
    print(f"[Rebate] Error: Required native terminal module missing: {e}", file=sys.stderr)
    sys.exit(1)

API_URL = os.environ.get("REBATE_API_URL", "http://localhost:3000")
DEVELOPER_ID = os.environ.get("REBATE_DEVELOPER_ID", "dev_alex_india")
REAL_AGY_PATH = os.environ.get("REBATE_REAL_AGY", r"C:\Users\yugsr\AppData\Local\agy\bin\agy-original.exe")

if not os.path.exists(REAL_AGY_PATH):
    # Fallback to normal agy.exe if agy-original doesn't exist yet
    REAL_AGY_PATH = r"C:\Users\yugsr\AppData\Local\agy\bin\agy.exe"

class RebateAgyProxy:
    def __init__(self):
        self.default_opportunity = {
            "id": "opp_jetbrains",
            "campaignId": "camp_jetbrains_ide",
            "title": "JetBrains IDEs — 50% Student & Pro Discount",
            "headline": "JetBrains IDEs — 50% Off",
            "destinationUrl": "https://www.jetbrains.com/community/education/"
        }
        self.active_opportunity = self.default_opportunity
        self.active_impression_id = "imp_initial_antigravity"
        self.wait_start_time = None
        self.is_generating = False
        self.session_id = f"sess_agy_{int(time.time() * 1000)}"
        self.lock = threading.Lock()
        self.proc = None

    def fetch_opportunity(self):
        try:
            url = f"{API_URL}/api/auction"
            payload = json.dumps({
                "developerId": DEVELOPER_ID,
                "sessionId": self.session_id,
                "agentType": "antigravity"
            }).encode("utf-8")
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if data.get("opportunity"):
                    with self.lock:
                        self.active_opportunity = data["opportunity"]
                        self.active_impression_id = data.get("impressionId") or self.active_impression_id
        except Exception:
            pass

    def settle_impression(self, duration_seconds):
        if not self.active_impression_id:
            return
        imp_id = self.active_impression_id
        self.active_impression_id = None
        started_at = (
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(self.wait_start_time))
            if self.wait_start_time
            else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        ended_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        def _settle():
            try:
                url = f"{API_URL}/api/ledger/impression"
                payload = json.dumps({
                    "impressionId": imp_id,
                    "developerId": DEVELOPER_ID,
                    "sessionId": self.session_id,
                    "agentType": "antigravity",
                    "startedAt": started_at,
                    "endedAt": ended_at,
                    "durationSeconds": max(2, int(duration_seconds)),
                    "customMinViewSeconds": 2
                }).encode("utf-8")
                req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
                urllib.request.urlopen(req, timeout=2.0)
            except Exception:
                pass

        threading.Thread(target=_settle, daemon=True).start()

    def run(self, argv):
        # Prefetch initial opportunity in background
        threading.Thread(target=self.fetch_opportunity, daemon=True).start()

        # Get current terminal dimensions
        try:
            cols, rows = os.get_terminal_size()
        except Exception:
            cols, rows = 120, 30

        # Launch real agy in PTY
        cmd = [REAL_AGY_PATH] + argv[1:]
        self.proc = PtyProcess.spawn(cmd, dimensions=(rows, cols))

        # Start input thread
        input_thread = threading.Thread(target=self._handle_input, daemon=True)
        input_thread.start()

        # Handle output in main thread
        try:
            while self.proc.isalive():
                try:
                    chunk = self.proc.read(1024)
                    if not chunk:
                        break
                    self._handle_output_chunk(chunk)
                except EOFError:
                    break
        except KeyboardInterrupt:
            pass
        finally:
            if self.proc.isalive():
                try:
                    self.proc.terminate()
                except Exception:
                    pass

    def _handle_output_chunk(self, chunk: str):
        # Check for Generating...
        if "Generating..." in chunk:
            now = time.time()
            if not self.is_generating:
                self.is_generating = True
                self.wait_start_time = now
                threading.Thread(target=self.fetch_opportunity, daemon=True).start()

            with self.lock:
                opp = self.active_opportunity

            if opp:
                title = opp.get("headline") or opp.get("title") or "Developer Opportunity"
                if len(title) > 42:
                    title = title[:40] + "…"
                replacement = f"Generating... \x1b[90m•\x1b[0m \x1b[36;1mSponsored: {title}\x1b[0m \x1b[90m[press o to view]\x1b[0m"
                chunk = chunk.replace("Generating...", replacement)

        elif self.is_generating:
            if "\r" in chunk or "\n" in chunk or len(chunk) > 30:
                duration = time.time() - (self.wait_start_time or time.time())
                self.is_generating = False
                self.settle_impression(duration)

        sys.stdout.write(chunk)
        sys.stdout.flush()

    def _handle_input(self):
        while self.proc.isalive():
            try:
                if msvcrt.kbhit():
                    ch = msvcrt.getwch()
                    if self.is_generating and ch in ('o', 'O'):
                        with self.lock:
                            opp = self.active_opportunity
                        if opp:
                            opp_id = opp.get("id")
                            dest_url = f"{API_URL}/opportunity/{opp_id}"
                            webbrowser.open(dest_url)
                            try:
                                def _click():
                                    click_url = f"{API_URL}/api/ledger/click"
                                    p = json.dumps({
                                        "campaignId": opp.get("campaignId"),
                                        "developerId": DEVELOPER_ID,
                                        "destinationUrl": opp.get("destinationUrl"),
                                        "impressionId": self.active_impression_id or "cli_click"
                                    }).encode('utf-8')
                                    req = urllib.request.Request(click_url, data=p, headers={"Content-Type": "application/json"})
                                    urllib.request.urlopen(req, timeout=2.0)
                                threading.Thread(target=_click, daemon=True).start()
                            except Exception:
                                pass
                        continue

                    if ch in ('\x00', '\xe0'):
                        ch2 = msvcrt.getwch()
                        self.proc.write(ch + ch2)
                    else:
                        self.proc.write(ch)
                else:
                    time.sleep(0.01)
            except Exception:
                break

if __name__ == '__main__':
    proxy = RebateAgyProxy()
    proxy.run(sys.argv)
