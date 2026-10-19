# Eval du routage de la doc dans AGENTS.md

date:: 2026-10-12
project:: clever-components
topic:: agents IA, AGENTS.md
status:: done
branch:: agentification
dossier:: [agents-md-eval](./)

## La question

`AGENTS.md` renvoie les agents vers `docs/contributing/` à la demande (tableau "Load on demand"). Est-ce que les agents ouvrent vraiment ces docs, et est-ce que ça change le résultat ?

## Ce que l'eval mesure

- Un agent headless (`claude -p`) reçoit une tâche dans une copie jetable du dépôt, sans historique git.
- 19 cas, 3 reps, deux modèles : Opus 5.5 et Sonnet 5.5.
- Notation 100 % programmatique, sur l'état final et sur le transcript :
  - **docs lues** : les docs que le tableau de routage demande pour la tâche ont été ouvertes ;
  - **règle respectée** : une règle écrite seulement dans la doc (ou dans `AGENTS.md`) est respectée dans le diff ou la réponse ;
  - **autres checks** : format, lint, stylelint, i18n, events map, fichiers interdits, scripts interdits.
- 12 cas exigent une doc, 7 sont des contrôles où aucune doc n'est nécessaire (pour voir la sur-lecture).

Il n'y a plus de juge LLM : il notait 1,00 partout, y compris sur des runs qui enfreignaient une règle.

## Résultats de référence

Mesurés sur `master` à `df86d064` (après le retrait du client legacy), avec la version finale d'`AGENTS.md`.

| | Opus 5.5 | Sonnet 5.5 |
|---|---|---|
| Cas avec doc requise : docs lues (36 runs) | 34 | 33 |
| Cas avec doc requise : règle respectée (36 runs) | 35 | 36 |
| Contrôles réussis (21 runs) | 21 | 21 |

Les échecs restants sont des docs non lues avec un résultat correct, plus un arrêt d'Opus sur un plan (voir plus bas). L'écart entre les deux modèles est dans le bruit : ne pas s'en servir pour les classer.

## Ce qu'on a appris

1. **Le routage marche pour "lequel j'utilise ?" et "comment je lance ça ?"** : tests, stories, formulaires, ADR, release. Les agents vont à la bonne doc presque à chaque fois.
2. **Pour une petite modification, les agents copient le code voisin et ne lisent pas la doc.** Tant que le voisin est conforme, le résultat est bon.
3. **Une règle écrite seulement dans une doc perd contre le code voisin quand ils se contredisent.** Sur le cas des tokens sans fallback dans `cc-notice`, 6 runs sur 6 ont copié le mauvais motif, y compris ceux qui avaient lu `wc-guidelines.md`.
4. **La même règle écrite dans `AGENTS.md` gagne contre le voisin** : 6 sur 6 après l'ajout de la phrase.
5. **Lire n'est pas suivre** : un agent peut ouvrir la doc et ne pas appliquer la règle.

## Ce qui a changé dans AGENTS.md grâce à l'eval

| Changement | Effet mesuré |
|---|---|
| Ligne "Create a new component: Always" avec les trois docs | docs lues sur le cas nouveau composant : 0 sur 6, puis 6 sur 6 |
| Phrase sur le fallback des design tokens | règle respectée : 0 sur 6, puis 6 sur 6 |
| Phrase sur le nouveau client API (devenue "le legacy a été retiré") | le seul cas où sauter la doc avait donné un mauvais résultat ne se reproduit plus |
| Ligne "Change an existing component" assouplie (le voisin suffit souvent) | aligne la consigne sur ce que les agents font déjà avec succès |
| Ligne "Release" vers `release.md` | les agents y allaient déjà alors qu'elle n'était pas listée |

Corrections de doc trouvées au passage : `smart-component.md` montrait `{ state: 'loading' }` au lieu de `{ type: 'loading' }`.

## Pistes non faites

- **Hooks ou règles outillées plutôt que du texte** : une règle stylelint pour le fallback des tokens (318 usages existants sans fallback à l'époque), un garde-fou dans les scripts `preview:*` et `cdn-*`, des hooks git `commit-msg` et `pre-commit`. Un `.claude/settings.json` committé marcherait pour les collègues sous Claude Code seulement.
- **Hooks globaux (home-manager)** : bloquer `--profile` vers le profil Zen, créer les fichiers lock de Playwright, vérifier `git add` avant `home-manager switch`.
- **Règles encore seulement dans les docs alors que le code existant est incohérent** : `readonly` plutôt que `disabled` pendant une sauvegarde, `role="group"` plutôt que `<fieldset>`, `plural()`.
- **Lignes du tableau sans cas** : `agent-tooling.md`, `codebase-map.md`, `clever-client.md`.
- **Plan d'abord** : la consigne de mon `CLAUDE.md` global fait parfois s'arrêter Opus sur un plan en mode headless (quelques runs, toujours sur les grosses tâches). À cadrer si je lance des agents sans surveillance.

## Limites

- 3 reps par cas : assez pour voir un passage de 0 sur 6 à 6 sur 6, pas pour un écart de quelques points.
- L'eval est au plafond : elle détecte une régression, pas une amélioration. Pour apprendre plus, il faut des cas plus durs, pas plus de reps.
- Les agents tournent avec `--dangerously-skip-permissions`, dans des copies jetables sans remote git, serveurs MCP coupés, plafond de 6 $ par run.

## Relancer l'eval

Depuis le dossier `agents-md-eval/` de cette note. Le dépôt testé est `~/dev/projects/github/clever-components` par défaut (`EVAL_REPO` pour en changer). Les docs évaluées sont celles de l'arbre de travail du dépôt, donc les modifications non committées comptent.

```bash
# auto-test des graders, gratuit (aucun appel modèle)
node selftest.mjs

# enregistrer l'empreinte du harness (une fois, ou après toute modification de lib.mjs ou cases.json)
node run-eval.mjs --flow results --variant baseline --model claude-opus-5-5 --cases NONE --approve-harness

# run complet, 3 reps (baseline = Opus, v1 = Sonnet)
node run-eval.mjs --flow results --variant baseline --model claude-opus-5-5 --reps 3 --concurrency 3
node run-eval.mjs --flow results --variant v1 --model claude-sonnet-5-5 --reps 3 --concurrency 3
```

À savoir avant de relancer :

- Les lignes déjà présentes dans `results/<variante>/results.jsonl` sont sautées : pour refaire une référence, mettre les anciens dossiers de côté d'abord.
- `base_sha` dans `cases.json` fige le commit du code testé. Le mettre à jour quand `master` bouge beaucoup, puis relancer `selftest.mjs` pour voir si les seeds s'appliquent encore.
- Le rapport HTML se régénère avec le script `build-report-lite.mjs` du skill `claude-api` de Claude Code (il faut invoquer `/claude-api` une fois pour l'extraire).
- Les espaces de travail vont dans `/tmp/clever-components-agents-md-eval` et sont supprimés au fur et à mesure.

## Coût

Environ 80 $ sur l'ensemble du travail (tarifs API rapportés par le CLI), dont environ 26 $ pour un run de référence complet à 3 reps (17,60 $ Opus, 8,70 $ Sonnet).

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `cases.json` | les 19 cas : prompt, docs requises, checks, commit de base |
| `lib.mjs` | construction des espaces de travail, lancement de l'agent, graders |
| `run-eval.mjs` | runner (reprise, erreurs à part, empreinte du harness) |
| `selftest.mjs` | 57 scénarios : solution de référence, violation, tentative vide |
| `seeds/` | patchs qui préparent l'état de départ de certains cas |
| `results/baseline`, `results/v1` | résultats de référence Opus et Sonnet, avec les traces |
| `results/archive/` | runs précédents (anciennes formulations, ancienne base) |
