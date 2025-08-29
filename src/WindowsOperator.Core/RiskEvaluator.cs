namespace WindowsOperator.Core;

/// <summary>
/// Naive risk detection used to gate confirmations for dangerous operations.
/// </summary>
public static class RiskEvaluator
{
    private static readonly string[] HighRiskKeywords =
    [
        "uninstall", "registry", "delete", "format", "shutdown", "firewall"
    ];

    public static bool IsHighRisk(string text)
    {
        var lower = text.ToLowerInvariant();
        return HighRiskKeywords.Any(k => lower.Contains(k));
    }
}
