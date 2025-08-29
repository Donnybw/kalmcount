# Packages the WindowsOperator app into an MSIX bundle.
# Usage: powershell -ExecutionPolicy Bypass -File Scripts/Package.ps1
& dotnet publish src/WindowsOperator/WindowsOperator.csproj -c Release -p:WindowsPackageType=None -r win10-x64 --self-contained
