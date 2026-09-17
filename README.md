# SportConnect Pro

Plateforme web de gestion sportive et associative développée dans le
cadre du **Sprint 1 --- YouCode Maroc 2026/2027**.

## 📋 Présentation

**SportConnect Pro** est une application destinée à la gestion des
infrastructures sportives, des associations, des activités, des
adhérents et des inscriptions sportives.

Le projet met l'accent sur la compréhension du fonctionnement d'un
serveur HTTP bas niveau avec **Node.js natif**, la communication avec
**PostgreSQL** et l'implémentation de règles métier avec du SQL et des
transactions ACID.

## 🎯 Objectifs

Le projet permet notamment de travailler sur :

-   la création d'un serveur HTTP avec `http.createServer`
-   le routage avec `find-my-way`
-   le service des fichiers statiques avec `serve-static`
-   la gestion des formulaires POST avec `body-parser`
-   le rendu serveur avec `EJS`
-   la connexion PostgreSQL avec le driver natif `pg`
-   les requêtes SQL paramétrées
-   la séparation entre routes, services et configuration
-   les règles métier liées aux inscriptions sportives
-   les transactions ACID avec PostgreSQL

## 🛠️ Technologies utilisées

-   **Node.js**
-   **PostgreSQL**
-   **JavaScript**
-   **EJS**
-   **pg**
-   **find-my-way**
-   **serve-static**
-   **body-parser**
-   **dotenv**
-   HTML / CSS

> Le projet utilise volontairement `http.createServer` et ne repose pas
> sur Express, Koa, Fastify ou NestJS.

## 📁 Structure du projet

``` text
SPORTCONNECT_PRO/
│
├── database/
│   ├── schema.sql
│   ├── seeds.sql
│   └── queries_analytics.sql
│
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── services/
│   │   └── facilityService.js
│   │
│   ├── utils/
│   │   └── renderer.js
│   │
│   ├── router.js
│   ├── server.js
│   └── test-db.js
│
├── views/
│   ├── home.ejs
│   └── facilities.ejs
│
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## 🗄️ Base de données

La base de données PostgreSQL utilisée par l'application est :

``` text
sportconnect
```

Elle contient actuellement les principales tables :

-   `families`
-   `members`
-   `facilities`
-   `associations`
-   `activities`
-   `registrations`
-   `waiting_list`

Les données de démonstration sont disponibles dans :

``` text
database/seeds.sql
```

## ⚙️ Installation

### 1. Cloner le projet

``` bash
https://github.com/achrafelberkaoui/SPORTCONNECT_PRO.git
```


### 2. Installer les dépendances

``` bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

``` env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sportconnect
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
```

Le fichier `.env` ne doit pas être versionné.

## ▶️ Lancer le projet

Depuis la racine :

``` bash
node src/server.js
```

Le serveur est disponible sur :

``` text
http://localhost:3000
```

## 🔗 Routes actuelles

  Méthode   Route           Description
  --------- --------------- ----------------------------------
  GET       `/`             Page d'accueil
  GET       `/facilities`   Liste des infrastructures
  GET       `/activities`   Liste des activités
  POST      `/test`         Route de test du formulaire POST

## 🏗️ Architecture

Le projet suit une séparation simple :

``` text
Navigateur
    ↓
server.js
    ↓
find-my-way
    ↓
Controller / Route
    ↓
Service
    ↓
pg Pool
    ↓
PostgreSQL
```

Les requêtes SQL sont placées dans les services afin d'éviter de
mélanger la logique de routage et l'accès aux données.

## 🧠 Règles métier principales

Le projet doit gérer plusieurs règles métier :

### 1. Tarification

Le prix final dépend notamment :

-   du tarif de base de l'activité
-   du statut résident / non-résident
-   de la composition familiale
-   du quotient familial
-   du Pass'Sport
-   d'un prix minimum de 15 €

Le paiement peut être effectué en :

-   1 fois
-   3 fois avec une répartition 40 / 30 / 30

### 2. Sécurité des infrastructures

Une activité doit respecter :

-   la capacité ERP de l'infrastructure
-   l'absence de conflit horaire dans une même infrastructure

### 3. Éligibilité

L'inscription dépend notamment :

-   de l'âge de l'adhérent
-   de la catégorie d'âge de l'activité
-   du certificat médical
-   des règles particulières de certaines disciplines

### 4. Liste d'attente

Lorsque la capacité maximale est atteinte :

``` text
Inscription
    ↓
Activité complète ?
    ↓
Oui
    ↓
Liste d'attente
```

Lorsqu'une place se libère, le système peut promouvoir le candidat
prioritaire avec un délai de confirmation de 48 heures.

### 5. Transaction ACID

L'inscription doit utiliser une transaction PostgreSQL :

``` sql
BEGIN;

SELECT id, max_capacity
FROM activities
WHERE id = $1
FOR UPDATE;

-- Vérification des places

-- INSERT inscription ou liste d'attente

COMMIT;
```

En cas d'erreur :

``` sql
ROLLBACK;
```

## 📅 Progression du Sprint

### Day 1

-   Modélisation de la base de données
-   Création du schéma PostgreSQL
-   Contraintes et index
-   Données de test

### Day 2

-   Serveur HTTP natif
-   `find-my-way`
-   `serve-static`
-   `body-parser`
-   EJS

### Day 3

-   Configuration du Pool PostgreSQL avec `pg`
-   Première requête SQL
-   Service des infrastructures
-   Affichage des infrastructures avec EJS
-   CRUD des infrastructures et associations en cours

### Suite du projet

-   Gestion des conflits horaires
-   Vérification ERP
-   Gestion des adhérents
-   Éligibilité âge / certificat médical
-   Calcul du prix
-   Transactions ACID
-   Liste d'attente dynamique
-   Dashboard
-   Tests et documentation

## 🔐 Sécurité et bonnes pratiques

-   Les informations sensibles sont stockées dans `.env`.
-   `.env` et `node_modules/` sont exclus du dépôt avec `.gitignore`.
-   Les requêtes SQL utilisent des paramètres (`$1`, `$2`, etc.).
-   Les erreurs serveur sont gérées sans exposer les informations
    sensibles à l'utilisateur.

## 👨‍💻 Auteur

**Achraf El Berkaoui**

Projet réalisé dans le cadre de la formation **YouCode Maroc ---
Développement Web & Full Stack**.
