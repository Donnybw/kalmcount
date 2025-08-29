namespace WindowsOperator.Core.Tools;

/// <summary>
/// Placeholder for UI Automation. Real implementation uses Windows UIA APIs.
/// </summary>
public class UIAutomationTools
{
    public ToolResult FocusWindow(string? titleRegex = null, string? process = null, string? classRegex = null) =>
        new(false, Stderr: "UI automation not available on this platform");

    public ToolResult UiFind(string? nameRegex = null, string? automationId = null, string? controlType = null, int timeoutSec = 5) =>
        new(false, Stderr: "UI automation not available on this platform");

    public ToolResult UiClick(string path) =>
        new(false, Stderr: "UI automation not available on this platform");

    public ToolResult TypeText(string text, int wpm = 300) =>
        new(false, Stderr: "SendInput not available on this platform");

    public ToolResult Hotkey(params string[] keys) =>
        new(false, Stderr: "SendInput not available on this platform");
}
