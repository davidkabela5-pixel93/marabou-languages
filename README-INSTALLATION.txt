MARABOU LANGUAGES — VERSION 2
============================

Cette mise à jour conserve la PWA existante et ses icônes. Elle ajoute 24 leçons structurées A1-A2, 30 questions de quiz, 35 fiches de vocabulaire et un tableau de bord avec historique local des séances, minutes étudiées, activité sur 7 jours et scores par domaine.

MISE À JOUR GITHUB
1. Ouvre le dépôt GitHub marabou-languages.
2. Remplace index.html, app.js, style.css, manifest.webmanifest et sw.js par les fichiers de cette archive.
3. Conserve le dossier icons déjà présent dans ton dépôt : les icônes ne sont pas modifiées dans cette version.
4. Valide les changements (Commit changes) et attends la fin du déploiement GitHub Pages.
5. Sur iPhone, ferme puis rouvre Marabou Languages. Si l'ancienne interface reste affichée, ferme complètement la PWA et recharge le site dans Safari. Le cache du service worker est maintenant versionné en v2.

DONNÉES ET PROGRESSION
- La progression existante est conservée grâce à la même clé de stockage local « marabouState ».
- Les nouvelles séances, résultats et durées sont enregistrés localement sur l'appareil / le navigateur.
- Les données ne sont pas synchronisées entre appareils et ne sont pas envoyées à un serveur.
- Les anciennes validations des 12 chapitres sont remappées vers les nouvelles leçons les plus proches de leur thème. Les compteurs journaliers, la série, le meilleur quiz et le nombre de quiz sont conservés.
- Les minutes des nouvelles séances sont comptabilisées dans le nouvel historique. Les anciens compteurs journaliers sont conservés mais ne sont pas convertis en séances détaillées.

CONTENU
- 12 semaines, 2 leçons par semaine.
- Grammaire, vocabulaire, conversation et compréhension.
- Synthèse vocale espagnole via le navigateur / iOS.
- Aucun système de vies ni paiement.
