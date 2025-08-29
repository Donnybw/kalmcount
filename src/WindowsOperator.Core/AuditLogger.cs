using System.Text.Json;

namespace WindowsOperator.Core;

/// <summary>
/// Writes a jsonl audit log of tool calls.
/// </summary>
public class AuditLogger
{
    private readonly string _logDir;

    public AuditLogger(string? baseDir = null)
    {
        var local = baseDir ?? Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        _logDir = Path.Combine(local, "WindowsOperator", "logs");
        Directory.CreateDirectory(_logDir);
    }

    public async Task LogAsync(object entry)
    {
        var file = Path.Combine(_logDir, DateTime.UtcNow.ToString("yyyyMMdd") + ".jsonl");
        var line = JsonSerializer.Serialize(entry);
        await File.AppendAllTextAsync(file, line + Environment.NewLine);
    }
}
