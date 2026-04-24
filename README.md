# Compétitivité Explorer FR

Application Next.js (static export) pour le diagnostic de compétitivité des PME françaises, développée par **NexDeal Advisory**. Inclut un bot de diagnostic, un portail partenaire (gated Firebase Auth), une médiathèque et un export CSV des leads.

## Stack

- **Next.js 16** (App Router, `output: export`)
- **React 19**, **TypeScript 5**
- **Firebase** (Auth, Firestore, Storage) — config via `NEXT_PUBLIC_*`
- **Tailwind CSS 4**, **Framer Motion**, **D3**, **Zustand**
- **Vitest** + **Testing Library** pour les tests
- **ESLint** (next/core-web-vitals + react-hooks)

## Prérequis

- Node.js ≥ 22
- Un projet Firebase (Auth par email/password activé, Firestore, Storage)

## Installation

```bash
npm install
cp .env.example .env.local
# Remplis les variables NEXT_PUBLIC_FIREBASE_* depuis Firebase Console > Project settings
npm run dev
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur Next.js local |
| `npm run build` | Build statique (`out/`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (runner unique) |

## Accès admin (portail partenaires)

Le portail admin est protégé par **Firebase Auth** avec un **custom claim** `admin: true`. Pour créer un admin :

1. Crée un utilisateur email/password dans Firebase Console (Authentication > Users).
2. Pose le custom claim via le Admin SDK (script Node à lancer localement) :

   ```js
   // scripts/set-admin.mjs
   import admin from "firebase-admin";
   admin.initializeApp({ credential: admin.credential.applicationDefault() });
   const uid = process.argv[2];
   await admin.auth().setCustomUserClaims(uid, { admin: true });
   console.log(`Admin claim posé sur ${uid}`);
   ```

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   node scripts/set-admin.mjs <uid-utilisateur>
   ```

3. L'utilisateur se reconnecte via le bouton "Portail Partenaires" de la home.

> Sans le claim `admin`, la connexion réussit mais le dashboard ne s'affiche pas (contrôle côté client **et** côté Firestore rules).

## Règles Firestore & Storage

Les règles sont versionnées dans `firestore.rules` et `storage.rules`.

```bash
# Déployer les règles uniquement
firebase deploy --only firestore:rules,storage
```

Résumé :

- **Firestore `macro_france_diagnostics`** : `create` ouvert (avec validation stricte du schéma), `read/update/delete` réservé aux admins.
- **Firestore `stats`** : `read` public, `write` admin uniquement.
- **Storage `macro_france_media/`** : `read` public, `write/delete` admin uniquement, taille max 10 Mo, MIME whitelist (PNG/JPEG/WEBP/GIF/MP4/PDF).

## Déploiement Hosting

```bash
npm run build
firebase deploy --only hosting
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) exécute lint + typecheck + test + build sur chaque PR et sur `main`.

## Notes de sécurité

- Aucun secret dans le repo : les clés Firebase sont publiques par design (`NEXT_PUBLIC_*`), la sécurité repose sur les règles Firestore/Storage.
- Upload de fichiers : validé côté client (MIME, taille) **et** re-validé côté Storage rules.
- Export CSV : échappement anti-injection de formule (`=`, `+`, `-`, `@`).
