export type CcAddonAccessUniqueState =
  | CcAddonAccessUniqueStateLoadingWithTabs
  | CcAddonAccessUniqueStateLoadingWithoutTabs
  | CcAddonAccessUniqueStateError
  | CcAddonAccessUniqueStateLoadedWithTabs
  | CcAddonAccessUniqueStateLoadedWithoutTabs;

export interface CcAddonAccessUniqueStateLoadingWithTabs {
  type: 'loading-with-tabs';
  tabs?: Array<TabContent>;
  cliCommand?: string;
}

export interface CcAddonAccessUniqueStateLoadingWithoutTabs {
  type: 'loading-without-tabs';
  content?: Content;
  cliCommand?: string;
}

export interface CcAddonAccessUniqueStateLoadedWithTabs {
  type: 'loaded-with-tabs';
  tabs: Array<TabContent>;
  cliCommand: string;
}

export interface CcAddonAccessUniqueStateLoadedWithoutTabs {
  type: 'loaded-without-tabs';
  content: Content;
  cliCommand: string;
}

export interface CcAddonAccessUniqueStateError {
  type: 'error';
}

interface Content {
  user?: string;
  password?: string;
  networkGroup?: string;
  apiClientUser?: string;
  apiClientSecret?: string;
  apiUrl?: string;
  host?: string;
  port?: string;
  token?: string;
  directHost?: string;
  directPort?: string;
  directUri?: string;
  databaseName?: string;
  clusterFullName?: string;
  uri?: string;
}

interface TabContent extends Content {
  tabName: TabName;
}

export type TabName = 'default' | 'api' | 'direct' | 'elastic' | 'apm' | 'kibana';
