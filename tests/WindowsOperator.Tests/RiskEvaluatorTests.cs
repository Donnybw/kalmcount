using WindowsOperator.Core;
using Xunit;

namespace WindowsOperator.Tests;

public class RiskEvaluatorTests
{
    [Fact]
    public void UninstallIsHighRisk()
    {
        Assert.True(RiskEvaluator.IsHighRisk("Please uninstall FooApp"));
    }
}
