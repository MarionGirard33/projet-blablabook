#!/bin/sh
# 1. étape de préparation 
# lancement des migration avec Drizzle
echo "Start migrate with Drizzle"
npm run migrate

# Vérifie si la commande précédente (npm run migrate) a échoué (code de sortie != 0)
if [ $? -ne 0 ]; then
  echo "Migration failed. Exiting."
  exit 1
fi

# 2. Lancement du backend 
echo "Start the server"
exec npm run start:dev
