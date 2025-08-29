using System.Diagnostics;
using System.Runtime.InteropServices;

namespace WindowsOperator.Core.Tools;

/// <summary>
/// Executes PowerShell commands. On non-Windows platforms this falls back to /bin/bash for tests.
/// </summary>
public class PowerShellTool
{
    public async Task<ToolResult> RunAsync(string command, int timeoutSec = 120)
    {
        var psi = new ProcessStartInfo();
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            psi.FileName = "powershell";
            psi.Arguments = $"-NoProfile -Command \"{command}\"";
        }
        else
        {
            // Fallback for test environments: run via bash
            psi.FileName = "bash";
            psi.Arguments = $"-lc \"{command}\"";
        }
        psi.RedirectStandardOutput = true;
        psi.RedirectStandardError = true;
        psi.UseShellExecute = false;

        var proc = Process.Start(psi)!;
        var sw = Stopwatch.StartNew();
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(timeoutSec));
        await Task.Run(() => proc.WaitForExit(), cts.Token).ConfigureAwait(false);
        var stdout = await proc.StandardOutput.ReadToEndAsync();
        var stderr = await proc.StandardError.ReadToEndAsync();
        sw.Stop();
        var success = proc.ExitCode == 0;
        return new ToolResult(success, stdout.Trim(), stderr.Trim(), proc.ExitCode, sw.Elapsed);
    }
}
