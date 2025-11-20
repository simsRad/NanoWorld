# PowerShell script to deploy NanoWorld to Power Apps
# This script fixes the PAC CLI issues with spaces in Windows user paths

Write-Host "Setting up environment for PAC CLI..." -ForegroundColor Green

# Get the short path for user directory to avoid space issues
$shortUserPath = (New-Object -ComObject Scripting.FileSystemObject).GetFolder("C:\Users\Simunye Radingwana").ShortPath
$shortAppDataPath = "$shortUserPath\AppData"

Write-Host "Short user path: $shortUserPath" -ForegroundColor Yellow
Write-Host "Short appdata path: $shortAppDataPath" -ForegroundColor Yellow

# Set environment variables for this session to use short paths
$env:USERPROFILE = $shortUserPath
$env:APPDATA = "$shortAppDataPath\Roaming"
$env:LOCALAPPDATA = "$shortAppDataPath\Local"
$env:TEMP = "$shortAppDataPath\Local\Temp"
$env:TMP = "$shortAppDataPath\Local\Temp"

Write-Host "Environment variables set for PAC CLI compatibility" -ForegroundColor Green

# Verify the environment
Write-Host "Current environment:" -ForegroundColor Cyan
Write-Host "USERPROFILE: $env:USERPROFILE"
Write-Host "APPDATA: $env:APPDATA"
Write-Host "LOCALAPPDATA: $env:LOCALAPPDATA"

# Build the project first
Write-Host "Building project..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Power Apps
Write-Host "Deploying to Power Apps..." -ForegroundColor Green
pac code push

Write-Host "Deployment complete!" -ForegroundColor Green