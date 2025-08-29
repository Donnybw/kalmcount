using System;
using System.IO;
using System.Threading.Tasks;
using WindowsOperator.Core.Tools;
using Xunit;

namespace WindowsOperator.Tests;

public class CompressArchiveTests
{
    [Fact]
    public async Task ZipSmokeTest()
    {
        var tool = new PowerShellTool();
        var temp = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(temp);
        var src = Path.Combine(temp, "a.txt");
        await File.WriteAllTextAsync(src, "hi");
        var dest = Path.Combine(temp, "out.zip");
        var cmd = $"cd '{temp}'; zip -r out.zip a.txt";
        var result = await tool.RunAsync(cmd);
        Assert.True(result.Success, result.Stderr);
        Assert.True(File.Exists(dest));
    }
}
