export type ElasticSearchInfoState = ElasticSearchInfoStateLoaded | ElasticSearchInfoStateLoading | ElasticSearchInfoStateError;

export interface ElasticSearchInfoStateLoaded {
  type: 'loaded';
  links: LinkLoaded[];
}

export interface ElasticSearchInfoStateLoading {
  type: 'loading';
  links: LinkLoading[];
}

export interface ElasticSearchInfoStateError {
  type: 'error';
}

export interface LinkLoaded {
  type: LinkType;
  href: string;
}

export interface LinkLoading {
  type: LinkType;
  href?: null;
}

export type LinkType = "elasticsearch" | "kibana" | "apm";
