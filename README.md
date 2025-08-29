# WindowsOperator

WindowsOperator is a WinUI 3 desktop assistant that executes voice or text commands on Windows using the OpenAI API. It exposes a safe tool layer (PowerShell, UI automation, keyboard/mouse and file I/O) and keeps a JSONL audit log of every action.

## Features
- Frameless overlay UI with command bar and microphone button.
- Global hotkey (**Ctrl+Space**) toggles the window.
- Streams audio to the OpenAI Realtime API and plays the model's voice responses.
- Planning loop with OpenAI Responses API and tool calling.
- Confirmation sheet for high-risk actions and persistent run history.

## Getting Started
1. Install the [Windows App SDK](https://learn.microsoft.com/windows/apps/windows-app-sdk/) and .NET 8 SDK.
2. Clone the repository and restore packages:
   ```powershell
   git clone <repo>
   cd repo
   dotnet restore WindowsOperator.sln
   ```
3. Provide an OpenAI API key through environment variable:
   ```powershell
   setx OPENAI_API_KEY "sk-..."
   ```
4. Run the app in development:
   ```powershell
   .\Scripts\DevRun.ps1
   ```

The default configuration is stored in `appsettings.json`. Override values in `appsettings.Development.json` or a `.env.local` file (not committed).

## Tests
Run unit tests with:
```powershell
 dotnet test tests/WindowsOperator.Tests/WindowsOperator.Tests.csproj
```

## Packaging
Create a self-contained publish build:
```powershell
 .\Scripts\Package.ps1
```

## Hotkeys
- **Ctrl+Space**: show/hide overlay
- **Ctrl+Shift+Space**: push-to-talk (optional)

## Logs
Audit logs are written to `%LOCALAPPDATA%\WindowsOperator\logs` as JSONL files. Each entry contains the tool name, arguments, results and timestamps.

## Environment Variables
- `OPENAI_API_KEY` – OpenAI credential

## Security
The tool layer rejects operations outside a sandbox path and warns before executing commands containing keywords such as *uninstall*, *delete* or *registry*.

