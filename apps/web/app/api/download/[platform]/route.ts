import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = (params.platform || '').toLowerCase();

  if (platform === 'windows' || platform === 'win-x64') {
    const script = `@echo off
echo ========================================================
echo  Rebate CLI Installer for Windows
echo  "While your AI works, Rebate works for you."
echo ========================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is required to run Rebate CLI. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Installing @rebate/cli globally via npm...
call npm install -g @rebate/cli

echo [3/3] Initializing Rebate local daemon...
echo Rebate CLI installed successfully!
echo.
echo Run "rebate start" to launch the background wait-state daemon.
echo Run "rebate --help" to view supported AI agent adapters.
echo ========================================================
pause
`;
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/x-bat',
        'Content-Disposition': 'attachment; filename="install-rebate.bat"',
      },
    });
  }

  if (platform === 'macos' || platform === 'darwin' || platform === 'linux') {
    const script = `#!/usr/bin/env bash
set -e

echo "========================================================"
echo " Rebate CLI Installer (macOS / Linux)"
echo " 'While your AI works, Rebate works for you.'"
echo "========================================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js 18+ is required. Please install Node.js first."
    exit 1
fi

echo "[1/2] Installing @rebate/cli globally..."
npm install -g @rebate/cli

echo "[2/2] Verifying installation..."
if command -v rebate >/dev/null 2>&1; then
    echo "Rebate CLI installed successfully!"
    echo "Run 'rebate start' to begin earning during AI wait states."
else
    echo "Rebate binary placed in npm global bin. Ensure npm bin is in your PATH."
fi
echo "========================================================"
`;
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/x-sh',
        'Content-Disposition': `attachment; filename="install-rebate-${platform}.sh"`,
      },
    });
  }

  // Generic fallback
  return NextResponse.json({
    version: '1.0.0',
    platform,
    npmCommand: 'npm install -g @rebate/cli',
    curlCommand: 'curl -fsSL https://rebate.dev/install.sh | bash',
  });
}
