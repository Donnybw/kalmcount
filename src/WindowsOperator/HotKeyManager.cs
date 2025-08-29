using System.Runtime.InteropServices;

namespace WindowsOperator;

internal static class HotKeyManager
{
    [DllImport("user32.dll")]
    public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);

    [DllImport("user32.dll")]
    public static extern bool UnregisterHotKey(IntPtr hWnd, int id);

    public const uint MOD_CONTROL = 0x0002;
    public const uint VK_SPACE = 0x20;
    public const int WM_HOTKEY = 0x0312;
}
