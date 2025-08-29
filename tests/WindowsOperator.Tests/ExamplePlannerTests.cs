using System.Linq;
using WindowsOperator.Core;
using Xunit;

namespace WindowsOperator.Tests;

public class ExamplePlannerTests
{
    [Fact]
    public void NotepadPlanHasExpectedSteps()
    {
        var planner = new ExamplePlanner();
        var plan = planner.Plan("Open Notepad, type 'hello', save to Desktop\\hello.txt, and show me the file.").ToList();
        Assert.True(plan.Count >= 4);
        Assert.Equal("open_app", plan[0].Tool);
        Assert.Equal("type_text", plan[1].Tool);
    }

    [Fact]
    public void UninstallNeedsConfirmation()
    {
        var planner = new ExamplePlanner();
        var plan = planner.Plan("Uninstall FooApp (winget)").ToList();
        Assert.Single(plan);
        Assert.Equal("run_powershell", plan[0].Tool);
        Assert.True(RiskEvaluator.IsHighRisk(plan[0].Arguments.GetProperty("command").GetString()!));
    }
}
