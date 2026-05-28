$loginUrl = "http://localhost:9000/auth/user/emailpass"
$seedUrl = "http://localhost:9000/admin/custom"

$loginBody = @{
    email = "admin@nihan.com"
    password = "supersecretpassword2026"
} | ConvertTo-Json

Write-Host "1. Logging in to Medusa v2 Admin Auth..."
try {
    $authResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
    $token = $authResponse.token

    if (-not $token) {
        Write-Error "Failed to obtain auth token. Response: $authResponse"
        exit 1
    }

    Write-Host "Success! Token retrieved."
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
    }

    Write-Host "2. Triggering custom luxury products & Stripe seeding..."
    $seedResponse = Invoke-RestMethod -Uri $seedUrl -Method Post -Headers $headers

    Write-Host "Response from server:"
    $seedResponse | ConvertTo-Json
} catch {
    Write-Error $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Error $_.ErrorDetails.Message
    }
}
