# Script de Lancement Global de Maison NIHAN
# Ce script lance pnpm dev, attend que le backend Medusa v2 soit prêt, puis exécute le seeding du catalogue de luxe.

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   DÉMARRAGE GLOBAL & SEEDING DE MAISON NIHAN" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

# 1. Start the dev servers in a new window to keep them active
Write-Host "`n1. Lancement des serveurs (Backend Medusa & Storefront Next.js)..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "pnpm dev" -WindowStyle Normal

# 2. Wait for the backend to be healthy
Write-Host "`n2. Attente de l'initialisation du serveur Medusa (http://localhost:9000/health)..." -ForegroundColor Cyan
$healthy = $false
$attempts = 0
$maxAttempts = 60 # 60 attempts = 180 seconds max

while (-not $healthy -and $attempts -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:9000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $healthy = $true
        }
    } catch {
        # Keep waiting
    }
    
    if (-not $healthy) {
        $attempts++
        Write-Host "   Attente du backend... ($attempts/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

if ($healthy) {
    Write-Host "`n[SUCCÈS] Le Backend Medusa v2 est actif et répond !" -ForegroundColor Green
    
    # 3. Trigger the luxury catalog and Stripe seeding
    Write-Host "`n3. Exécution automatique du seeding de luxe..." -ForegroundColor Cyan
    cd apps/backend
    .\trigger-luxury-seed.ps1
    cd ../..
    
    Write-Host "`n==========================================================" -ForegroundColor Yellow
    Write-Host "   [TOUT EST PRÊT !] Maison NIHAN est opérationnelle." -ForegroundColor Yellow
    Write-Host "   - Storefront Next.js : http://localhost:8000" -ForegroundColor Green
    Write-Host "   - Backend Medusa v2  : http://localhost:9000" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Yellow
} else {
    Write-Error "`n[ERREUR] Le backend Medusa n'a pas démarré à temps. Veuillez vérifier les logs dans l'autre fenêtre PowerShell."
}
