using System.Text;
using System.Threading.Tasks;
using WindowsOperator.Core.Tools;
using Xunit;

namespace WindowsOperator.Tests;

public class PowerShellToolTests
{
    [Fact]
    public async Task RunEchoWorks()
    {
        var tool = new PowerShellTool();
        var result = await tool.RunAsync("echo test");
        Assert.True(result.Success);
        Assert.Equal("test", result.Stdout.Trim());
    }
}
