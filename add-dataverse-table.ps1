# PowerShell script to add Dataverse table with proper environment setup
Write-Host "Setting up environment for PAC CLI..." -ForegroundColor Green

# Get short path to handle spaces in username
$shortUserPath = (Get-Item $env:USERPROFILE).FullName -replace ' ','~1' -replace 'Simunye','SIMUNY~1'
$shortAppDataPath = "$shortUserPath\AppData"

Write-Host "Short user path: $shortUserPath" -ForegroundColor Yellow
Write-Host "Short appdata path: $shortAppDataPath" -ForegroundColor Yellow

# Set environment variables for current session
$env:USERPROFILE = $shortUserPath
$env:APPDATA = "$shortAppDataPath\Roaming"
$env:LOCALAPPDATA = "$shortAppDataPath\Local"

Write-Host "Environment variables set for PAC CLI compatibility" -ForegroundColor Green

# Display current environment
Write-Host "Current environment:" -ForegroundColor Cyan
Write-Host "USERPROFILE: $env:USERPROFILE" -ForegroundColor White
Write-Host "APPDATA: $env:APPDATA" -ForegroundColor White
Write-Host "LOCALAPPDATA: $env:LOCALAPPDATA" -ForegroundColor White

Write-Host "Adding Dataverse table..." -ForegroundColor Green

# Run the PAC CLI command to add dataverse table
pac code add-data-source -a dataverse -t cr8ac_envtablecodeapps

Write-Host "Dataverse table addition complete!" -ForegroundColor Green