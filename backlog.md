# Clément

- [ ] - refactor form pour le typage erreur dégueulasse que j'ai pondu (le any)
- [ ] - trier les patates sur les infos user présent dans le local storage => pas ouf pour la sécu de laisser tout trainer

## Test

- [x] login (cookie présent + localstorage avec les data) = OK
- [x] logout (cookie supprimer + refresh token supprimer + localStorage vide) = OK
- [ ] guard (erreur si j'ai pas les tokens, requete refuser si pas les token )
- [ ] refresh (si jwt expiré, j'ai bien le refresh de token + pas de doublon de refresh token)
