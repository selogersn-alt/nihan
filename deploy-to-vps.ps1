param(
    [string]$VPS_IP = "157.180.127.70",
    [string]$VPS_USER = "root",
    [string]$REMOTE_DIR = "/root/nihan-backend"
)

Write-Host "Envoi des fichiers corrigés vers le VPS ($VPS_IP)..." -ForegroundColor Cyan

# 1. Copie du fichier Dockerfile Backend
Write-Host "-> Envoi du Dockerfile Backend..."
scp .\apps\backend\Dockerfile ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/apps/backend/Dockerfile

# 2. Copie du fichier index.tsx Storefront
Write-Host "-> Envoi du fichier index.tsx (Storefront)..."
scp .\apps\storefront\src\modules\diagnostic\index.tsx ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/apps/storefront/src/modules/diagnostic/index.tsx

# 2.5 Copie de medusa-config.ts
Write-Host "-> Envoi du fichier medusa-config.ts..."
scp .\apps\backend\medusa-config.ts ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/apps/backend/medusa-config.ts

Write-Host "Les fichiers ont été copiés. Redémarrage des conteneurs sur le VPS..." -ForegroundColor Cyan

# 3. Connexion SSH pour rebuild et restart
ssh ${VPS_USER}@${VPS_IP} "cd $REMOTE_DIR && docker compose build maison-nihan-backend maison-nihan-storefront && docker compose up -d"

Write-Host "✅ Déploiement terminé ! Le backend devrait maintenant démarrer correctement." -ForegroundColor Green
