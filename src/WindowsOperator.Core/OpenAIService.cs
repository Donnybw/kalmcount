using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace WindowsOperator.Core;

/// <summary>
/// Minimal client for OpenAI Responses and Realtime APIs. Networking is reduced to simple HTTP calls.
/// </summary>
public class OpenAIService
{
    private readonly HttpClient _http;

    public OpenAIService(HttpClient? http = null)
    {
        _http = http ?? new HttpClient();
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        if (!string.IsNullOrEmpty(apiKey))
        {
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        }
    }

    public async Task<string> CreateResponseAsync(string model, IEnumerable<object> messages, IEnumerable<object>? tools = null)
    {
        var payload = new
        {
            model,
            messages,
            tools
        };
        var json = JsonSerializer.Serialize(payload);
        var resp = await _http.PostAsync("https://api.openai.com/v1/responses", new StringContent(json, Encoding.UTF8, "application/json"));
        var text = await resp.Content.ReadAsStringAsync();
        return text;
    }

    // The realtime API requires WebSockets. For brevity this is left as a stub.
}
