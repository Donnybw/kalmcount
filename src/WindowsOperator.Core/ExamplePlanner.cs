using System.Text.Json;
using WindowsOperator.Core.Tools;

namespace WindowsOperator.Core;

/// <summary>
/// Extremely small rule-based planner used for unit tests and as a fallback when OpenAI is unavailable.
/// </summary>
public class ExamplePlanner
{
    public record PlanStep(string Tool, JsonElement Arguments);

    /// <summary>
    /// Builds a deterministic plan for known example requests.
    /// </summary>
    public IEnumerable<PlanStep> Plan(string request)
    {
        if (request.Contains("Open Notepad", StringComparison.OrdinalIgnoreCase))
        {
            yield return new PlanStep("open_app", JsonSerializer.Deserialize<JsonElement>("{\"path\":\"notepad.exe\"}"));
            yield return new PlanStep("type_text", JsonSerializer.Deserialize<JsonElement>("{\"text\":\"hello\"}"));
            yield return new PlanStep("file_write", JsonSerializer.Deserialize<JsonElement>("{\"path\":\"Desktop/hello.txt\",\"content_base64\":\"aGVsbG8=\",\"overwrite\":true}"));
            yield return new PlanStep("open_app", JsonSerializer.Deserialize<JsonElement>("{\"path\":\"explorer.exe\",\"args\":\"Desktop\"}"));
        }
        else if (request.Contains("Zip", StringComparison.OrdinalIgnoreCase))
        {
            yield return new PlanStep("run_powershell", JsonSerializer.Deserialize<JsonElement>("{\"command\":\"Compress-Archive -Path Desktop/Logs -DestinationPath Desktop/logs.zip -Force\"}"));
            yield return new PlanStep("open_app", JsonSerializer.Deserialize<JsonElement>("{\"path\":\"explorer.exe\",\"args\":\"Desktop\"}"));
        }
        else if (request.Contains("Uninstall", StringComparison.OrdinalIgnoreCase))
        {
            yield return new PlanStep("run_powershell", JsonSerializer.Deserialize<JsonElement>("{\"command\":\"winget uninstall FooApp\"}"));
        }
        else
        {
            // unknown, no plan
        }
    }
}
