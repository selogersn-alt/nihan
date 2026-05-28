# Script de Push Git Automatique vers GitHub (Maison NIHAN)
# Ce script initialise git, configure le dépôt distant correct, et pousse tout le code local en ligne.

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   CHARGEMENT DU CODE SUR GITHUB (MAISON NIHAN)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

$repoUrl = "https://github.com/selogersn-alt/nihan.git"

# 1. Initialize Git if not already done
if (-not (Test-Path .git)) {
    Write-Host "`n1. Initialisation du dépôt Git local..." -ForegroundColor Cyan
    git init
} else {
    Write-Host "`n1. Dépôt Git local déjà initialisé." -ForegroundColor Green
}

# 2. Check and configure remote origin URL
Write-Host "`n2. Configuration de l'adresse distante (origin)..." -ForegroundColor Cyan
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    if ($existingRemote -ne $repoUrl) {
        Write-Host "   Mise à jour de l'adresse distante : $repoUrl" -ForegroundColor Yellow
        git remote set-url origin $repoUrl
    } else {
        Write-Host "   Adresse distante déjà bien configurée : $repoUrl" -ForegroundColor Green
    }
} else {
    Write-Host "   Ajout de la nouvelle adresse distante : $repoUrl" -ForegroundColor Green
    git remote add origin $repoUrl
}

# 3. Add and commit all local files
Write-Host "`n3. Préparation et indexation des fichiers locaux..." -ForegroundColor Cyan
git add .

Write-Host "`n4. Création du commit de prestige..." -ForegroundColor Cyan
git commit -m "feat: integration Docker complete, ouverture CORS local network et diagnostic de prestige" 2>$null

# 4. Set branch to main and push to GitHub
Write-Host "`n5. Envoi du code sur GitHub (branche main)..." -ForegroundColor Cyan
git branch -M main
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Yellow
    Write-Host "   [SUCCÈS !] Votre code est en ligne sur GitHub !" -ForegroundColor Green
    Write-Host "   Vous pouvez maintenant retourner sur votre VPS et faire :" -ForegroundColor Yellow
    Write-Host "   git pull origin main" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Yellow
} else {
    Write-Error "`n[ERREUR] Échec de l'envoi vers GitHub. Veuillez vérifier vos identifiants ou droits d'accès."
}
