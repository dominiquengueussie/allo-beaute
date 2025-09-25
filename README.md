# AllôBeauté - Guide de Déploiement en Production

Ce document détaille la procédure complète pour déployer l'application front-end Nuxt 3 du projet AllôBeauté sur un serveur de production.

## 1. Prérequis

Avant de commencer, assurez-vous que les outils suivants sont installés sur votre serveur de production :

- **Git** : Pour cloner le dépôt.
- **Node.js** : Version 18.x ou supérieure.
- **NPM** (ou `yarn`/`pnpm`) : Généralement installé avec Node.js.
- **PM2** : Un gestionnaire de processus pour Node.js qui maintiendra l'application en ligne.
- **Nginx** (Recommandé) : Un serveur web qui agira comme reverse proxy.

---

## 2. Installation

Suivez ces étapes pour préparer l'application sur votre serveur.

### a. Cloner le dépôt

Connectez-vous à votre serveur et clonez le projet depuis GitHub.

```bash

git clone https://github.com/FTgroup-Tika-Place/nuxt-app-allo-beaute.git

cd allobeaute-frontend


### b. Installer les dépendances

Installez toutes les dépendances du projet avec `npm`.

```bash
npm install
```

---

## 3. Configuration

La configuration de l'application se fait via un fichier d'environnement.

### a. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet. Ce fichier contiendra les variables d'environnement spécifiques à la production.

```bash
touch .env
```

### b. Définir les variables d'environnement

Ouvrez le fichier `.env` et ajoutez les variables nécessaires. Pour ce projet, la variable la plus importante est l'URL de l'API.

```dotenv
# .env

# URL de base de votre API backend
NUXT_PUBLIC_API_BASE_URL="https://demo-allobeaute.tikaplace.com/api"

# D'autres variables pourraient être ajoutées ici (clés API, etc.)
```

**Note importante** : Le code actuel utilise des URL en dur. Il est fortement recommandé de refactoriser les appels `useFetch` et `$fetch` pour utiliser cette variable d'environnement (`useRuntimeConfig().public.apiBaseUrl`).

---

## 4. Build de l'application

Une fois l'application configurée, vous devez la compiler pour la production.

```bash
npm run build
```

Cette commande va créer un répertoire `.output` optimisé, contenant tout le nécessaire pour exécuter l'application en mode serveur.

---

## 5. Déploiement avec PM2

PM2 est un gestionnaire de processus qui va démarrer votre application, la maintenir en ligne 24/7 et la redémarrer automatiquement en cas de crash.

### a. Installer PM2

Si PM2 n'est pas déjà installé, installez-le globalement :

```bash
npm install pm2 -g
```

### b. Démarrer l'application

Lancez le serveur Nuxt généré dans le dossier `.output` avec PM2.

```bash
# Le nom "allobeaute-frontend" est un alias pour gérer facilement le processus
pm2 start .output/server/index.mjs --name "allobeaute-frontend"
```

### c. Commandes utiles de PM2

- **Lister les applications** : `pm2 list`
- **Voir les logs** : `pm2 logs allobeaute-frontend`
- **Redémarrer l'application** : `pm2 restart allobeaute-frontend`
- **Arrêter l'application** : `pm2 stop allobeaute-frontend`

### d. Sauvegarder la configuration PM2

Pour que PM2 redémarre automatiquement l'application après un redémarrage du serveur :

```bash
pm2 save
pm2 startup
```

Suivez les instructions affichées par la commande `pm2 startup`.

---

## 6. Configuration de Nginx (Recommandé)

Il est recommandé de ne pas exposer directement le port de l'application Node.js (par défaut 3000). Utilisez Nginx comme reverse proxy pour rediriger le trafic du port 80 (HTTP) ou 443 (HTTPS) vers votre application.

1.  **Créez un fichier de configuration** pour votre site dans `/etc/nginx/sites-available/allobeaute.conf`.
2.  **Ajoutez la configuration suivante** (adaptez `server_name` avec votre nom de domaine) :

    ```nginx
    server {
        listen 80;
        server_name votre-domaine.com;

        location / {
            proxy_pass http://localhost:3000; # Port par défaut de Nuxt
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Activez la configuration et redémarrez Nginx** :

    ```bash
    sudo ln -s /etc/nginx/sites-available/allobeaute.conf /etc/nginx/sites-enabled/
    sudo nginx -t # Pour tester la configuration
    sudo systemctl restart nginx
    ```

4.  **(Optionnel mais crucial) Configurer SSL avec Let's Encrypt** :

    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d votre-domaine.com
    ```

Votre application est maintenant déployée et accessible publiquement !