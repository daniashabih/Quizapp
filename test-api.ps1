Write-Host "===== Testing API Endpoints =====`n"

Write-Host "1. GET /api/categories"
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
    Write-Host "   STATUS: 200 OK"
    Write-Host "   RESPONSE: $($r | ConvertTo-Json -Compress)"
} catch {
    Write-Host "   STATUS: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "   ERROR: $($_.Exception.Message)"
}
Write-Host ""

Write-Host "2. GET / (Root)"
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
    Write-Host "   STATUS: 200 OK"
    Write-Host "   RESPONSE: $r"
} catch {
    Write-Host "   STATUS: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "   ERROR: $($_.Exception.Message)"
}
Write-Host ""

Write-Host "===== Done ====="
