using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using WindowsOperator.Core.Tools;
using Xunit;

namespace WindowsOperator.Tests;

public class FileToolsTests
{
    [Fact]
    public async Task WriteAndReadRoundTrip()
    {
        var sandbox = Path.Combine(Path.GetTempPath(), "wo-test");
        Directory.CreateDirectory(sandbox);
        var tool = new FileTools(sandbox);
        var path = Path.Combine(sandbox, "hello.txt");
        var content = Encoding.UTF8.GetBytes("hello world");
        var write = await tool.WriteAsync(path, content, overwrite: true);
        Assert.True(write.Success);
        var (bytes, ok) = await tool.ReadAsync(path);
        Assert.True(ok);
        Assert.Equal("hello world", Encoding.UTF8.GetString(bytes!));
    }
}
