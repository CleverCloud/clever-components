## Conception clever-config (nom à définir) avec Pierre

### Existant

* Repasser sur convict
  * Dernière 6.2.3 2022 sur GitHub
  * Dernière 6.2.4 2023 sur npm
  * Plusieurs packages (principal + formatters)
  * De base, il sait gérer les argv et les env vars
  * Codée pour Node.js en CJS
  * Mélange de déclaration "nom, type, doc" / "source env var et args"
* Lister nos besoins
  * Notre système de tag (client, serveur, thème)
  * ESM
  * Validation strict
  * Généreration de la doc
  * Dump des valeurs non secrète au démarrage
  * Projets cible
    * Console
    * Clever tools
    * Auth backend
    * Redis HTTP
    * Composants (storybook) ?
    * Client API JS ?
  * Sources
    * Un générique objet clé/valeur (valeur string)
    * Env vars
    * local JSON (node)
    * local storage (browser)
    * settings API (async)
    * args (node) ?
  * Point spécifique de la manière dont c'est géré côté console
  * Pourquoi pas utiliser zod ?
    * ça va apporter de la complexité, attention
    * validation des inputs
    * génération des types
  * On aime bien le :
    * Déclaration pure objet JavaScript (schéma)
    * Puis ajout de validateur
    * Puis ajout de sources
    * Puis validation strict
    * ...
    * Puis get les valeurs
  * Schéma
    * tags
    * format (validateurs qui vont bien)
      * clé string simple
      * énum
      * validateur multiples chainés (int, gt)
    * default value
    * optionnel
    * secret / sensitive
    * documentation ("en" et d'autres locale si besoin)
      * chaine de caractère directe
    * dependencies
      * on valide/coerce d'abord ces variables et on les passe au validateur
  * Format
    * boolean
    * URL
    * number
      * integer
      * port
    * string
      * string
      * non-empty
      * X length minimum
    * enum de valeurs
    * dates ?
    * duration ? (ISO)
    * (custom)
      * le formatteur custom doit avoir une doc
    * surcharge ?
  * Pourquoi pas mélanger validate/coerce dans les validateur custom
  * Imbrication ?
    * Cas analytics de la console
    * Convict a un système de chargement groupé à base d'objet et de `_`
    * Validateurs globaux (qui inclut plusieurs variables)
    * Imbrication à base de `_`

### Réflexion sur le optionnal

optionnel true default value 'foo'
valeur 'bar' => 'bar'
valeur (rien) => 'foo' OK

optionnel false default value 'foo'
valeur 'bar' => 'bar'
valeur (rien) => 'foo' OK

optionnel true default value (rien)
valeur 'bar' => 'bar'
valeur (rien) => (rien) OK (sauf si format)

optionnel false default value (rien)
valeur 'bar' => 'bar'
valeur (rien) => KO

Il y a quand même confusion sur les 2 premiers cas.
Le cas numéro 2 n'a pas de sens.

### Reflexion sur les dépendances

* AES_ENCRYPTION_CURRENT_KEY
  * a besoin de AES_ENCRYPTION_KEYS
  * la valeur doit être une des clés de AES_ENCRYPTION_KEYS
* ANALYTICS_URL
  * a besoin ANALYTICS_ENABLED
  * si c'est une URL et pas null, ANALYTICS_ENABLED doit être true
  * si c'est pas configuré, ANALYTICS_ENABLED doit être false
* ANALYTICS_ENABLED
  * a besoin ANALYTICS_URL
  * si c'est true, ANALYTICS_URL doit être défini
