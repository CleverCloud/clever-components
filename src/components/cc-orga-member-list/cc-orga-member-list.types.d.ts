import { OrgaMemberCardState, OrgaMemberRole } from '../cc-orga-member-card/cc-orga-member-card.types';

export interface InviteMemberFormState {
  state: 'idle' | 'inviting';
  email: EmailFormField;
  role: RoleFormField;
}

interface EmailFormField {
  value: string;
  error?: 'empty' | 'invalid' | 'duplicate' | null;
}

// TODO: si on décide que pas de valeur par défaut, alors il nous faudra un type error 'empty'
interface RoleFormField {
  value: OrgaMemberRole;
}

export type OrgaMemberListState = OrgaMemberListStateLoading | OrgaMemberListStateLoaded | OrgaMemberListStateError;

interface OrgaMemberListStateLoading {
  state: 'loading';
}

interface OrgaMemberListStateLoaded {
  state: 'loaded';
  value: OrgaMemberCardState[];
  identityFilter: string;
  mfaFilter: string;
  filters: {
    state: string;
    identity: {
      value: string;
      error: string;
    };
    mfa: {
      value: string;
      error: string;
    }
  }
}

// vire les error des champs de formulaire
// vire ...
// ...
// oui mais il faut ajouter un event "update-filters" qui passe les valeurs des filtres
// oui mais on a pas vraiment besoin dans le smart
// la seule raison pour laquelle on veut pouvoir set ces filtres depuis l'extérieur, c'est de pouvoir reset
// l'autre raison pourrait être d'avoir des stories directement dans un état avec un filtrage
// => on fait un resetFilters()

interface OrgaMemberListStateError {
  state: 'error';
}

export interface InviteMemberPayload {
  email: string,
  role: string,
}
