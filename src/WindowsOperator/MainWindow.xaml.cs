using System;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using WindowsOperator.Core.Tools;

namespace WindowsOperator;

public sealed partial class MainWindow : Window
{
    private readonly PowerShellTool _ps = new();
    private readonly int _hotkeyId = 1;
    private readonly IntPtr _hwnd;

    public MainWindow()
    {
        this.InitializeComponent();
        _hwnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
        HotKeyManager.RegisterHotKey(_hwnd, _hotkeyId, HotKeyManager.MOD_CONTROL, HotKeyManager.VK_SPACE);
        this.Closed += (_, __) => HotKeyManager.UnregisterHotKey(_hwnd, _hotkeyId);
    }

    private async void OnRunClicked(object sender, RoutedEventArgs e)
    {
        var command = CommandBox.Text;
        if (string.IsNullOrWhiteSpace(command)) return;
        var result = await _ps.RunAsync(command);
        RunList.Items.Add($"{(result.Success ? "\u2713" : "\u2717")} {command} -> {result.Stdout}");
    }
}
