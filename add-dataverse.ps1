# PowerShell script to add Dataverse data source with proper environment handling
param(
    [string]$ApiId = "shared_commondataserviceforapps",
    [string]$ConnectionId = "default"
)

Write-Host "Setting up environment for PAC CLI..." -ForegroundColor Green

# Get the short path for user directory to avoid space issues
$shortUserPath = (New-Object -ComObject Scripting.FileSystemObject).GetFolder("C:\Users\Simunye Radingwana").ShortPath
$shortAppDataPath = "$shortUserPath\AppData"

# Set environment variables for this session AND for the process
[System.Environment]::SetEnvironmentVariable("USERPROFILE", $shortUserPath, [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable("APPDATA", "$shortAppDataPath\Roaming", [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable("LOCALAPPDATA", "$shortAppDataPath\Local", [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable("TEMP", "$shortAppDataPath\Local\Temp", [System.EnvironmentVariableTarget]::Process)
[System.Environment]::SetEnvironmentVariable("TMP", "$shortAppDataPath\Local\Temp", [System.EnvironmentVariableTarget]::Process)

# Also set in current PowerShell session
$env:USERPROFILE = $shortUserPath
$env:APPDATA = "$shortAppDataPath\Roaming"
$env:LOCALAPPDATA = "$shortAppDataPath\Local"
$env:TEMP = "$shortAppDataPath\Local\Temp"
$env:TMP = "$shortAppDataPath\Local\Temp"

Write-Host "Environment variables configured" -ForegroundColor Green
Write-Host "USERPROFILE: $env:USERPROFILE" -ForegroundColor Yellow

# Try to add the Dataverse data source
Write-Host "Adding Dataverse data source..." -ForegroundColor Green
Write-Host "Command: pac code add-data-source -a `"$ApiId`"" -ForegroundColor Cyan

try {
    & pac code add-data-source -a $ApiId
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dataverse data source added successfully!" -ForegroundColor Green
    } else {
        Write-Host "PAC CLI returned exit code: $LASTEXITCODE" -ForegroundColor Yellow
        Write-Host "The data source may still have been configured. Check power.config.json" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error running PAC CLI: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Will configure manually in power.config.json" -ForegroundColor Yellow
}

Write-Host "Script completed!" -ForegroundColor Green