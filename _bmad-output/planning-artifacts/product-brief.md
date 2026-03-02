# Product Brief — PayFit SEO/GEO Hackathon
> Version FINALE | Statut : Figé

---

## 🎯 Contexte & Mission

**Client :** PayFit — logiciel de paie et RH (SaaS B2B)
**Canal principal :** Organic search (SEO/GEO)
**Mission PayFit :** "Vous voulez garder la main sur votre paie et vos RH. Mais surtout, ne pas y passer des heures ? PayFit digitalise et centralise tous vos besoins."
**Concurrents directs :** Factorial, Lucca, Cegid, Sage

---

## 👥 Cibles

| Profil | Rôle dans le funnel |
|--------|-------------------|
| **Employé** | Vecteur SEO (volume massif) + ambassadeur viral → convainc son dirigeant |
| **Fondateur / Dirigeant TPE-PME** | Cible principale d'acquisition PayFit |

**Profil fondateur TPE/PME :**
- Pas de DRH — il est lui-même le DRH
- Peur viscérale de l'URSSAF
- 10 casquettes à la fois
- Moment d'acquisition clé : recrutement du 1er employé

---

## ❗ 3 Problématiques + Qui les couvre

| # | Problème | Qui | Notre réponse |
|---|----------|-----|--------------|
| 1 | Créer du contenu en masse avec l'IA tout en maintenant l'expertise perçue | Collègues (blog) | — |
| 2 | Détecter les questions émergentes avant la concurrence | Notre équipe | Effet Spotify + JO scraping + Radar RH |
| 3 | No-code tools pour soutenir le SEO en 2026 | Notre équipe | 4 outils interactifs + Programmatic SEO |

---

## 🔄 Le Loop d'Acquisition Complet

```
EMPLOYÉ cherche "comprendre ma fiche de paie"
        ↓
[OUTIL 1A] Décodeur — trafic massif SEO
        ↓
Bouton "Partager à mon dirigeant" — email pré-rédigé professionnel
        ↓
FONDATEUR découvre PayFit via son employé
        ↓
[OUTIL 3] Checklist Premier Employé — moment de recrutement
        ↓
[OUTIL 2] Calendrier de Conformité — il revient chaque mois
        ↓
[OUTIL 1B] Calculateur brut/net — il simule, il fait confiance
        ↓
LEAD PAYFIT QUALIFIÉ
```

> **L'insight clé :** Les employés cherchent "comprendre ma fiche de paie" 10x plus que les DRH cherchent "logiciel de paie". En capturant ce trafic B2C, on crée un canal d'acquisition B2B inexploité par tous les concurrents.

---

## 🏆 Les 4 Outils

---

### 🛠️ OUTIL 1A — Le Décodeur de Fiche de Paie
**Utilisateur :** Employé
**Positionnement :** Éducatif — "Comprends ta fiche de paie" (pas "vérifie tes erreurs")

L'employé entre ses lignes de bulletin → explication en français simple de chaque ligne → à la fin : bouton "Partager à mon dirigeant" avec email pré-rédigé.

**Mots-clés :** comprendre sa fiche de paie / fiche de paie explication / à quoi correspondent les cotisations / calcul heures de travail

**Stack :** Lovable + Claude API + Supabase

---

### 🛠️ OUTIL 1B — Le Calculateur Brut/Net
**Utilisateur :** Fondateur TPE-PME
**Note :** Même page que 1A, mode "Je suis employeur"

Slider salaire brut → calcul net + coût employeur en temps réel. Champs : secteur, statut (cadre/non-cadre), taille entreprise.

**Mots-clés :** calculateur salaire net brut / simulateur coût salarié / calculateur ROI embauche / logiciel de paie gratuit

**Stack :** Lovable + Supabase + N8n (MAJ taux auto)

---

### 🛠️ OUTIL 2 — Le Calendrier de Conformité TPE
**Utilisateur :** Fondateur TPE-PME

Toutes les échéances RH/paie filtrées par secteur et taille. Sync Google Calendar 1 clic. Widget embarquable pour experts-comptables = backlinks naturels.

**Mécaniques :** Rétention mensuelle + Widget = backlinks + Alertes WhatsApp 48h avant chaque échéance

**Mots-clés :** calendrier URSSAF 2026 / dates DSN 2026 / obligations employeur / échéances paie TPE

**Stack :** Lovable + N8n + Apify + Supabase

---

### 🛠️ OUTIL 3 — La Checklist du Premier Employé
**Utilisateur :** Fondateur qui recrute pour la 1ère fois

Guide interactif étape par étape. Chaque étape = risque juridique si ratée + simulateur coût salarial intégré.

**C'est LE moment d'acquisition PayFit** — anxieux, en recherche active, prêt à payer.

**Mots-clés :** recruter premier employé / documents embauche obligatoires / DPAE comment faire / SIRH TPE

**Stack :** Lovable + Claude API + Supabase + N8n

---

## 📈 Stratégie SEO

### Pilier 1 — Programmatic SEO
Générer automatiquement des milliers de pages ultra-spécifiques :

```
Template × Données réelles = Pages genuinement utiles

Combinaisons :
├── /explication/[ligne-de-bulletin]     → ~150 pages
├── /fiche-de-paie/[secteur]/[statut]   → ~500 pages
├── /convention-collective/[top-30]      → ~300 pages
└── /tendances/[Effet Spotify auto]      → illimité
```

**Qualité garantie par :** vraies données conventions collectives + vraies questions du Décodeur + Claude pour personnalisation

**Où ça vit :**
- Hackathon → prototype Lovable
- Production → payfit.fr ou tools.payfit.fr

### Pilier 2 — Parasite SEO (résultats immédiats)
Publier sur des domaines déjà autoritaires sans attendre :

```
Reddit (r/france, r/entrepreneur)  → rank en 48h
LinkedIn Articles                  → rank en 3 jours
Quora France                       → rank immédiat
```

**Pour le pitch :** montrer des vraies visites en live sur Google Analytics pendant la présentation.

### Pilier 3 — Backlinks naturels
```
Widget Calendrier embarquable → experts-comptables l'intègrent
Indice PayFit (données uniques) → journalistes citent → presse
Citation Magnets → IA citent → trafic direct
```

### Pilier 4 — Topical Authority
Couvrir exhaustivement l'univers "fiche de paie française" = Google nous considère comme LA référence sur tout le sujet.

---

## 🤖 Stratégie GEO

### Comment les IA décident quoi citer

```
1. Réponse courte et précise EN PREMIER (pas après 500 mots d'intro)
2. Sources officielles citées dans le contenu (Urssaf, Code du travail)
3. Schema Markup FAQ (format natif des IA)
4. Données uniques et originales (Citation Magnets)
```

### Les Citation Magnets
Stats uniques générées par nos outils (anonymisées) que les IA citent car introuvables ailleurs :

```
"Selon PayFit Tools 2026 :
- 73% des TPE sous-estiment leur coût employeur de +15%"
- "Le coût moyen d'un premier employé en France est de X€"
- "67% des fondateurs ratent la DPAE lors du 1er recrutement"
```

### Le Flywheel GEO
```
Outils → Data réelle → Stats uniques
   ↑                         ↓
Plus d'utilisateurs    IA nous citent
   ↑                         ↓
Brand awareness    "Selon PayFit..." dans les réponses IA
```

### Mesure du GEO
- Volume de recherche directe "PayFit" (personnes qui tapent PayFit après l'avoir entendu d'une IA)
- Mentions dans ChatGPT / Perplexity / Gemini
- Trafic direct (branded)

---

## 🔄 L'Effet Spotify — Le Pont Entre Nos Outils et le Blog

```
Utilisateurs du Décodeur posent une question inhabituelle
        ↓
N8n détecte l'anomalie statistique (+3x en une semaine)
        ↓
Signal automatique aux collègues du blog :
"La prime de partage de valeur monte — publiez maintenant"
        ↓
Article publié avant la concurrence
        ↓
PayFit rank #1 sur un sujet émergent
```

**Données secondaires :** Apify scrape le Journal Officiel → nouvelles lois RH publiées 3-6 mois avant application → contenu publié avant que les gens cherchent.

---

## 🗺️ Architecture du Site (Lovable)

```
[Microsite PayFit Tools]
│
├── /fiche-de-paie                    → Outils 1A + 1B
│     ├── ?mode=employe               → Décodeur
│     └── ?mode=employeur             → Calculateur
│
├── /calendrier-conformite            → Outil 2
│     └── /widget                     → Embarquable
│
├── /premier-employe                  → Outil 3
│
├── /radar-rh                         → Effet Spotify public
│
└── Pages SEO programmatiques :
      ├── /explication/[ligne]        ex: /explication/CSG-deductible
      ├── /fiche-de-paie/[secteur]    ex: /fiche-de-paie/restauration
      ├── /convention/[nom]           ex: /convention/metallurgie
      └── /echeance/[type]            ex: /echeance/DSN-mensuelle
```

---

## 🔧 Stack Technique

| Outil | Rôle |
|-------|------|
| **Lovable** | Frontend — interface de tous les outils |
| **N8n** | Orchestration — connecte tout + briefs auto blog |
| **Apify** | Scraping — JO + Reddit + tendances émergentes |
| **Claude API** | Intelligence — explications, Q&A, stats, contenu |
| **Supabase** | Base de données — règles, taux, dates, usage |
| **Schema Markup** | GEO — format natif pour les IA |
| **SEMrush** | Recherche amont uniquement |

---

## 💰 Le Tunnel Business (pour les juges)

```
100 000 visiteurs/mois (Programmatic + Parasite + Outils)
        ↓ 3% cliquent sur CTA PayFit
3 000 visites PayFit qualifiées
        ↓ 10% s'inscrivent
300 inscrits essai gratuit
        ↓ 20% convertissent
60 nouveaux clients PayFit/mois
        ↓
60 × 89€ × 12 mois = 63 720€ MRR annuel généré
```

---

## 🎤 Le Pitch aux Juges

**Ce qu'on ne dit pas :** "On a fait un site avec des outils"

**Ce qu'on dit :** "On a construit une machine SEO/GEO autonome"

```
MINUTE 1 — Le problème
"Factorial et Lucca occupent déjà les gros mots-clés.
Battre la concurrence sur SEO classique = impossible."

MINUTE 2 — Notre insight
"Personne ne capture le trafic des EMPLOYÉS.
10x plus de volume. Zéro concurrence."

MINUTE 3 — La démo live
Décodeur en action. Page programmatique générée en 10 secondes.

MINUTE 4 — Le système
Effet Spotify. JO scraping. Citation Magnets. GEO Flywheel.

MINUTE 5 — Les chiffres
63 720€ MRR annuel. Déployable sur payfit.fr en 2 semaines.
```

---

## ✅ Ce qu'on construit cette semaine

| Priorité | Livrable | Outil |
|----------|---------|-------|
| 🔴 Must have | Décodeur + Calculateur fonctionnel | Lovable |
| 🔴 Must have | 20 pages programmatiques pilotes | Lovable + Claude |
| 🔴 Must have | Radar RH avec Effet Spotify visible | Lovable + N8n |
| 🟡 Should have | Calendrier de Conformité | Lovable |
| 🟡 Should have | Checklist Premier Employé (maquette) | Lovable |
| 🟢 Nice to have | Widget embarquable | Lovable |
| 🟢 Nice to have | Parasite SEO live (Reddit/LinkedIn) | Manuel |

---

## 🚫 Ce qu'on ne fait PAS

- Vérificateur de conformité pour clients existants (trop risqué — feedback PayFit)
- Analyser les bulletins de clients PayFit actuels
- Promettre des rankings SEO immédiats sur notre domaine Lovable

---

*Version FINALE — Brainstorming sessions 1 à 6 complétées*
*Techniques utilisées : What If / Cross-Pollination / Reversal Inversion / First Principles / Party Mode × 4*
