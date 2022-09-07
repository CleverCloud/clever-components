---
kind: '📌 Docs'
---
# How to define properties and state

THIS IS A WIP FRENCH VERSION FOR NOW...

## State

### Cas simple

Comme on le faisait déjà avant (via le template d'issue de création de composants), il faut identifier :

* Les inputs (properties, attributes, slots, CSS custom prop...)
* Les ouputs (update, submit et autres événements déclenchés par des actions utilisateur)
* Les APIs nécessaires
* Les stories/states

Parmi les inputs, on doit identifier ce qui vient d'une source de données et ce qui fait partie de la "config" du composant.

Pour les inputs qui font partie de la config du composant, on peut les définir directement sur le composant avec leur type.

Exemples :

* env-var-form: context, heading, readonly
* cc-tcp-redirection-form: context
* cc-pricing-product: action, features, currency maybe, temporality

Pour les inputs qui viennent d'une source de donnée, il faut prévoir les états loading, loaded et error-loading.
Dans ces cas là, on nomme la propriété du composant comme l'input mais il s'agira d'un objet avec une propriété `state` de type `string` et une propriété pour la valeur du type de la valeur. On peut nommer son type avec le type de la donnée plus un suffixe `State`.

?? Comment est-ce qu'on appelle cette valeur ?
=> `value`, `data`...

Exemple pour les variables des vars d'env :

```ts
static get properties () {
  return {
    // variables est de type VariablesState
    variables: { type: Object }
  };
}

interface VariablesState {
    state: string;
    value?: Variable[];
}

interface Variable {
    name: string;
    value: string;
}
```

### Cas avec plusieurs inputs venant de sources de données

Si on a plusieurs inputs qui viennent de sources de données, on va privilégier le fait de synchroniser les appels en un seul via `Promise.all`. Du coup, on vient grouper ces données sur la même propriété dans un objet avec un état commun. Ça simplifie le code, les changements d'état et la gestion d'erreurs.

?? Comment est-ce qu'on appelle cette propriété qui regroupe les données ?
=> `state`, `data`, `fooAndBar`...
?? Comment est-ce qu'on appelle son type ?

Exemple pour les vars d'env qui ont besoin de la liste des variables mais aussi du nom de l'app :

```ts
static get properties () {
  return {
    // data est de type EnvVarFormState
    data: { type: Object }
  };
}

interface EnvVarFormState {
    state: string;
    appName: string;
    variables: Variable[];
}

interface Variable {
    name: string;
    value: string;
}
```

Si ça a du sens pour l'utilisateur, on sépare les inputs indépendants. Ils ont donc chacun leur état de chargement, d'erreur...

Exemple pour le header d'app où c'est "un peu long d'obtenir l'état d'une app" mais assez rapide d'obtenir le nom/type...

```ts
static get properties () {
  return {
    // app est de type AppState
    app: { type: Object },
    // status est de type AppStatusState
    status: { type: Object },
  };
}

interface AppState {
    state: string;
    value: App;
}

interface AppStatusState {
    state: string;
    value: AppStatus;
}

interface App {
    ...
}

type AppStatus = "foo" | "bar"
```

### Introduction de types algébrique (je crois que c'est ça qu'on dit :p)

Pour que TypeScript puisse nous aider, on peut se baser sur des types algébrique au lieu d'avoir un state en string ou enum de string et une value optionnelle.

Exemple avec le formulaire de vars d'env:

```ts
static get properties () {
  return {
    // data est de type EnvVarFormState
    data: { type: Object }
  };
}

type EnvVarFormState = EnvVarFormLoadingState | EnvVarFormLoadedState | EnvVarFormErrorLoadingState;

interface EnvVarFormLoadingState {
    state: 'loading';
}

interface EnvVarFormLoadedState {
    state: 'loaded';
    appName: string;
    variables: Variable[];
}

interface EnvVarFormErrorLoadingState {
    state: 'error-loading';
}

interface Variable {
    name: string;
    value: string;
}
```

Avec ça, on va aider les IDE et demain on pourra même lancer TypeScript dans la CI pour faire du typechecking sur notre code JS.

### Cas avec des mises à jour (simple)

Si le composant propose des actions utilisateur de type "mise à jour de données" / envoi de formulaire.
En plus des états loading, loaded et error-loading, il faut prévoir des états pour la mise à jour.
Pour des cas de mises à jour "simples" où l'API n'est pas vraiment capable de dire autre chose à par "ça marche pas", on pourra se limiter à un état supplémentaire :

* waiting/saving/updating
    * on peut être précis sur le nom de l'action qui se passe
* En cas de succès, on toast et on repasse à l'état loaded
* En cas d'erreur, on toast et on repasse sur l'état loaded

Exemple avec les vars d'env et leur mise à jour :

(je vous épargne la recopie de tous les autres types)

```ts
type EnvVarFormState = EnvVarFormLoadingState | EnvVarFormLoadedState | EnvVarFormErrorLoadingState | EnvVarFormUpdatingState;

interface EnvVarFormLoadingState {
    state: 'updating';
    appName: string;
    variables: Variable[];
}
```

### Cas avec des mises à jour (complexes)

Pour des cas de mise à jour "complexes" où l'API peut nous indiquer quelle erreur il y a et sur quel champs de formulaire, on va devoir être un peu plus détaillé.

On remplacera probablement le toast par un affichage contextualisé de l'erreur.
Ça peut vouloir dire un état en plus pour l'erreur avec le suffixe de l'action, du genre `error-updating`.

Si on fait ça, on peut afficher un message d'erreur global à tout le composant/formulaire via une notice.

?? J'ai pas vraiment d'exemple en tête.

S'il y a plusieurs types d'erreurs, je vois 2 solutions :

* autant de state `error-*` que de type d'erreur
* un seul state `error-foo` et une propriété `error` avec différent types

?? On préfère quoi ? J'ai toujours pas d'exemple en tête.

J'ai l'impression que la plupart du temps, les messages d'erreur seront spécifiques à des champs de formulaire.
Il faudra donc imbriquer la valeur et le state définisant l'erreur pour chaque champs.
On peut avoir un `FormField` assez générique :

```ts
interface FormField {
    state: string;
    value: string;
    error: string; // code
}
```

TODO: Il faudra probablement utiliser des types algébriques là dessus aussi.

Si on part là dessus, on pourra gérer les cas où c'est le composant lui même qui gère le déclenchement de certains changement d'état vers error pour trigger des erreurs de types "le champs est vide"...

### Etats imbriqués

Qu'est ce qu'on fait quand on a des listes qui ont chacune des états indépendants ?
=> On imbrique un état sur chaque élément.

Exemple avec les redirections TCP, elles sont soit en `loaded`, soit en `waiting`.
La différenciation creating vs deleting, se fait via la donnée (présence d'un port).

```ts
static get properties () {
  return {
    // redirections est de type RedirectionsState
    redirections: { type: Object }
  };
}

type RedirectionsState = RedirectionsLoadingState | RedirectionsLoadedState | RedirectionsErrorLoadingState;

interface RedirectionsLoadingState {
    state: 'loading';
}

interface RedirectionsLoadedState {
    state: 'loaded';
    value: Redirection[];
}

interface RedirectionsErrorLoadingState {
    state: 'error-loading';
}

interface Redirection {
    state: 'loaded' | 'waiting';
    namespace: string;
    sourcePort?: number;
}
```

?? Est-ce qu'on garde ce `waiting` unique ou est-ce qu'on a besoin de `creating`/`deleting` ?

?? Est-ce qu'il nous faut des types algébriques pour la `Redirection` ?
=> dans ce cas précis, non mais ça pourrait arriver

?? Est-ce qu'il faut envisager d'imbriquer les données sur un objet au même niveau que le state ?

```ts
interface RedirectionState {
    state: 'loaded' | 'waiting';
    value: Redirection;
}

interface Redirection {
    namespace: string;
    port: number;
}
```

### Remarques supplémentaires et questions ?

* Je pense que du coup, on a pas forcément besoin de méthode reset
    * La définition smart maitrise les valeurs qui viennent de source de données, elle sait le remettre à zéro (le plus souvent `{ state: "loading" }`)
* On doit pouvoir exposer dans les composants une méthode `.focus()` ou `.focusItem()` pour les items de liste et l'appeler dans la définition smart lors d'une disparition d'élément du DOM
* Gestion des états interne vs on reload tout

?? Est-ce qu'on essaie tout de suite de simplifier les types qui reviennt tout le temps via des generics, ça va vite devenir verbeux mais un peu moins cryptique que des generics qui s'imbrique à foison.


### pour les fameux "3 composants"

#### cc-email

* emails
    * state: loading, loaded, error-loading
    * primary:
        * value: string
        * confirmed: boolean
    * secondary:
        * Array
            * state: loaded, marking-as-confirmed, deleting
            * value: string
            * confirmed: boolean
* newEmail
    * state: idle, creating
    * value: string
    * error: empty, format, size

#### cc-ssh-keys

#### cc-orga-members

## Gestion des formulaires

* J'ai l'impression qu'avec notre découverte du `live`, on devrait pouvoir arrêter de gérer des états privés pour un composant du genre `_name` et `name`
* Est-ce qu'on ne devrait pas se baser un peu plus sur le valeurs du DOM avec des ref?
