# Script de Déploiement Staging Global en 1 Clic (Maison NIHAN)
# Ce script pousse votre code sur GitHub, copie le mot de passe du VPS dans votre presse-papiers,
# puis se connecte en SSH au VPS pour déclencher la mise à jour et la reconstruction automatique.

$vpsIp = "157.180.127.70"
$vpsUser = "root"
$vpsPassword = "AkueMax@2022"

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   DÉPLOIEMENT STAGING AUTOMATIQUE EN 1 CLIC" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

# 1. Pousser le code local sur GitHub
Write-Host "`n1. Envoi de vos dernières corrections locales sur GitHub..." -ForegroundColor Cyan
.\git-push.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Error "`n[ERREUR] Impossible d'envoyer le code sur GitHub. Déploiement annulé."
    exit 1
}

# 2. Copier le mot de passe dans le presse-papiers pour un confort maximal
Write-Host "`n2. Copie du mot de passe dans votre presse-papiers..." -ForegroundColor Cyan
Set-Clipboard -Value $vpsPassword

Write-Host "----------------------------------------------------------" -ForegroundColor Yellow
Write-Host "👉 LE MOT DE PASSE A ÉTÉ COPIÉ DANS VOTRE PRESSE-PAPIERS !" -ForegroundColor Green
Write-Host "   Faites un simple CLIC-DROIT (ou Ctrl+V) pour le coller" -ForegroundColor Green
Write-Host "   dès que la console SSH vous demandera le mot de passe." -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Yellow

# 3. Connexion SSH au VPS et exécution des commandes de mise à jour
Write-Host "`n3. Connexion SSH au VPS ($vpsIp) en cours..." -ForegroundColor Cyan
ssh -t "${vpsUser}@${vpsIp}" "cd nihan-backend && git pull origin main && ./deploy-vps.sh"

Write-Host "`n==========================================================" -ForegroundColor Yellow
Write-Host "   [FIN DE SESSION] Processus terminé." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
