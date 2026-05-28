#!/bin/bash

# ==============================================================================
# Script de Déploiement & Seeding Automatique sur le VPS (Maison NIHAN)
# ==============================================================================

# Couleurs pour le terminal
GOLD='\033[0;33m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GOLD}==========================================================${NC}"
echo -e "${GOLD}      DÉPLOIEMENT & INITIALISATION DE MAISON NIHAN${NC}"
echo -e "${GOLD}==========================================================${NC}"

# 1. Reconstruction et démarrage des conteneurs Docker
echo -e "\n${CYAN}1. Arrêt des anciens conteneurs et reconstruction...${NC}"
docker compose down
docker compose up --build -d

# 2. Attente que le conteneur Medusa Backend soit healthy
echo -e "\n${CYAN}2. Attente du démarrage de Medusa v2 sur le port 9000...${NC}"
healthy=false
attempts=0
max_attempts=40

while [ "$healthy" = false ] && [ $attempts -lt $max_attempts ]; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/health)
    if [ "$status_code" -eq 200 ]; then
        healthy=true
    else
        attempts=$((attempts+1))
        echo -e "   Attente du backend... ($attempts/$max_attempts)"
        sleep 3
    fi
done

if [ "$healthy" = true ]; then
    echo -e "\n${GREEN}[SUCCÈS] Le Backend Medusa v2 répond correctement !${NC}"
    
    # 3. Authentification Admin Medusa pour obtenir le Bearer Token
    echo -e "\n${CYAN}3. Connexion à l'espace d'administration Medusa...${NC}"
    login_response=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@nihan.com","password":"supersecretpassword2026"}')
    
    token=$(echo "$login_response" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
    
    if [ -z "$token" ]; then
        echo -e "${RED}[ERREUR] Impossible de récupérer le token d'administration. Réponse: $login_response${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}   Authentifié avec succès ! Token obtenu.${NC}"
    
    # 4. Déclenchement du workflow de seeding du catalogue de luxe & Stripe
    echo -e "\n${CYAN}4. Déclenchement du seeding du catalogue de luxe & Stripe...${NC}"
    seed_response=$(curl -s -X POST http://localhost:9000/admin/custom \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json")
    
    echo -e "${GREEN}   Réponse du serveur de seeding :${NC}"
    echo "$seed_response"
    
    echo -e "\n${GOLD}==========================================================${NC}"
    echo -e "${GOLD}   [TOUT EST OPÉRATIONNEL !] Maison NIHAN est en ligne.${NC}"
    echo -e "   - Storefront Next.js : http://nihan.digitalh.net (Port 8000)${NC}"
    echo -e "   - Backend Medusa v2  : http://nihan.digitalh.net:9000${NC}"
    echo -e "${GOLD}==========================================================${NC}"
else
    echo -e "\n${RED}[ERREUR] Le backend Medusa n'a pas démarré à temps. Veuillez inspecter les logs : docker compose logs maison-nihan-backend${NC}"
    exit 1
fi
