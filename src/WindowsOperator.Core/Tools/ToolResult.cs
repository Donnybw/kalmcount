namespace WindowsOperator.Core.Tools;

/// <summary>
/// Result for any tool execution.
/// </summary>
public record ToolResult(bool Success, string? Stdout = null, string? Stderr = null, int ExitCode = 0, TimeSpan? Duration = null);
