# Kill all HMS related processes on Windows
$ports = @(8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 3000)

foreach ($port in $ports) {
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Killing process on port $port..." -ForegroundColor Red
            Stop-Process -Id $process.OwningProcess -Force
        }
    } catch {
        # Port not in use
    }
}

Write-Host "All HMS ports cleared!" -ForegroundColor Green
