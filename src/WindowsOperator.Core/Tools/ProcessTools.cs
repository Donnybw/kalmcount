using System.Diagnostics;

namespace WindowsOperator.Core.Tools;

/// <summary>
/// Launches external applications.
/// </summary>
public class ProcessTools
{
    public ToolResult Open(string path, string? args = null, string? cwd = null)
    {
        var psi = new ProcessStartInfo(path, args ?? string.Empty)
        {
            WorkingDirectory = cwd ?? string.Empty,
            UseShellExecute = true
        };
        try
        {
            Process.Start(psi);
            return new ToolResult(true);
        }
        catch (Exception ex)
        {
            return new ToolResult(false, Stderr: ex.Message);
        }
    }
}
