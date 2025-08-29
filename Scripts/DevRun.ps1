# Runs the WindowsOperator app in development mode.
# Usage: powershell -ExecutionPolicy Bypass -File Scripts/DevRun.ps1
$env:DOTNET_ENVIRONMENT = "Development"
& dotnet build WindowsOperator.sln
& dotnet run --project src/WindowsOperator/WindowsOperator.csproj
