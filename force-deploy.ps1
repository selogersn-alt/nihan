Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DÉPLOIEMENT COMPLET ET RÉINITIALISATION (ANTI-BLOCAGE)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Commit and push local changes
Write-Host "`n1. Envoi des nouvelles corrections (Base de données & Redis) sur GitHub..." -ForegroundColor Yellow
git add .
git commit -m "fix: ajout redisUrl et sleep pour postgres, lien symbolique pnpm"
git push origin main

# 2. Execute commands on VPS
Write-Host "`n2. Connexion au VPS pour nettoyer et redémarrer..." -ForegroundColor Yellow
Write-Host ">>> ATTENTION : Préparez-vous à coller le mot de passe AkueMax@2022 <<<" -ForegroundColor Red

$SSH_CMD = "cd /root/nihan-backend && git fetch origin && git reset --hard origin/main && docker compose down && docker compose build maison-nihan-storefront && docker compose up -d"

ssh root@157.180.127.70 $SSH_CMD
