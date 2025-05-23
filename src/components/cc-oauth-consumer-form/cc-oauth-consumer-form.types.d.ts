import { FormDataMap } from '../../lib/form/form.types.js';
import { OauthConsumer, OauthConsumerRights } from '../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js';

export type OauthConsumerFormState =
  | OauthConsumerFormStateIdleCreate
  | OauthConsumerFormStateCreating
  | OauthConsumerFormStateIdleUpdate
  | OauthConsumerFormStateUpdating
  | OauthConsumerFormStateDeleting
  | OauthConsumerFormStateLoading
  | OauthConsumerFormStateError;

export interface OauthConsumerFormStateIdleCreate {
  type: 'idle-create';
}

export interface OauthConsumerFormStateCreating {
  type: 'creating';
}

export interface OauthConsumerFormStateIdleUpdate {
  type: 'idle-update';
  values: OauthConsumerWithoutKeyAndSecret;
}

export interface OauthConsumerFormStateUpdating {
  type: 'updating';
  values: OauthConsumerWithoutKeyAndSecret;
}

export interface OauthConsumerFormStateDeleting {
  type: 'deleting';
  values: OauthConsumerWithoutKeyAndSecret;
}

export interface OauthConsumerFormStateLoading {
  type: 'loading';
}

export interface OauthConsumerFormStateError {
  type: 'error';
}

export interface OauthConsumerFormData extends FormDataMap {
  name: string;
  description: string;
  url: string;
  picture: string;
  baseUrl: string;
  rights: Array<keyof OauthConsumerRights>;
}

export type OauthConsumerWithoutKeyAndSecret = Omit<OauthConsumer, 'key' | 'secret'>;
