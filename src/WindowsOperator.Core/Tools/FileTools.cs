using System.Text;

namespace WindowsOperator.Core.Tools;

/// <summary>
/// Simple sandboxed file operations.
/// </summary>
public class FileTools
{
    private readonly string _sandbox;

    public FileTools(string? sandbox = null)
    {
        _sandbox = sandbox ?? Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
    }

    private string Sanitize(string path)
    {
        var full = Path.GetFullPath(path);
        if (!full.StartsWith(_sandbox, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Path outside sandbox");
        return full;
    }

    public async Task<ToolResult> WriteAsync(string path, byte[] content, bool overwrite = false)
    {
        var full = Sanitize(path);
        var dir = Path.GetDirectoryName(full)!;
        Directory.CreateDirectory(dir);
        if (!overwrite && File.Exists(full))
            return new ToolResult(false, Stderr: "File exists");
        await File.WriteAllBytesAsync(full, content);
        return new ToolResult(true);
    }

    public async Task<(byte[]? content, bool success)> ReadAsync(string path, int maxBytes = 1_048_576)
    {
        var full = Sanitize(path);
        if (!File.Exists(full)) return (null, false);
        var bytes = await File.ReadAllBytesAsync(full);
        if (bytes.Length > maxBytes)
            bytes = bytes.Take(maxBytes).ToArray();
        return (bytes, true);
    }

    public Task<IEnumerable<string>> ListDirAsync(string path, string? pattern = null)
    {
        var full = Sanitize(path);
        if (!Directory.Exists(full)) return Task.FromResult<IEnumerable<string>>(Array.Empty<string>());
        var files = Directory.GetFileSystemEntries(full, pattern ?? "*");
        return Task.FromResult<IEnumerable<string>>(files);
    }
}
