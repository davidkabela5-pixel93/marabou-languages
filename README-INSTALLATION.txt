MARABOU LANGUAGES — PACKAGE PWA
================================

Ce dossier contient une application web installable (PWA) pour iPhone 15 Pro.
Ce n'est pas un fichier IPA ni une application App Store. Sur iPhone, les PWA
s'installent depuis un site web sécurisé (HTTPS), puis s'ajoutent à l'écran
d'accueil.

ÉTAPE 1 — HÉBERGER GRATUITEMENT
1. Crée un compte gratuit sur https://github.com si tu n'en as pas.
2. Crée un nouveau dépôt public nommé marabou-languages.
3. Téléverse TOUS les fichiers et dossiers de ce package à la racine du dépôt.
4. Dans le dépôt : Settings > Pages.
5. Dans Build and deployment, choisis "Deploy from a branch".
6. Sélectionne la branche "main" et le dossier "/ (root)", puis Save.
7. Attends quelques minutes. GitHub Pages affichera une adresse HTTPS du type :
   https://TON-PSEUDO.github.io/marabou-languages/

ÉTAPE 2 — INSTALLER SUR IPHONE 15 PRO
1. Ouvre l'adresse HTTPS publiée dans Chrome sur ton iPhone.
2. Si Chrome propose "Ajouter à l'écran d'accueil" dans le menu Partager/…,
   utilise cette option.
3. Si l'option n'apparaît pas dans Chrome, ouvre la même adresse dans Safari.
4. Dans Safari : bouton Partager > Sur l'écran d'accueil > Ajouter.
5. Lance Marabou depuis sa nouvelle icône.

À SAVOIR
- iOS peut imposer Safari pour l'ajout à l'écran d'accueil selon la version et
  les options disponibles dans le navigateur. L'application installée fonctionne
  ensuite comme une webapp autonome.
- Les cours, quiz et fiches sont intégrés au package. Le cache permet de les
  réutiliser hors connexion après le premier chargement.
- La progression est stockée localement sur l'appareil et dans le navigateur
  utilisé. Elle ne se synchronise pas automatiquement entre appareils.
- La prononciation utilise la synthèse vocale disponible sur l'appareil.
- Les polices Google peuvent nécessiter une connexion lors du premier affichage.
- Pour publier une mise à jour, remplace les fichiers du dépôt. Incrémente le
  nom du cache dans sw.js (CACHE="marabou-languages-v2") si tu modifies les
  ressources mises en cache.

Palette : violet profond #4c1d95, violet #6d28d9, lavande #ede9fe.
