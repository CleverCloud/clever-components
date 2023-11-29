export interface Log {
  id: string;
  date: Date;
  message: string;
  metadata: Array<Metadata>;
}

export interface Metadata {
  name: string;
  value: string;
}

export type MetadataRenderer = MetadataRenderingProvider | MetadataRendering;

export type MetadataRenderingProvider = (metadata: Metadata) => MetadataRendering;

export interface MetadataRendering {
  hidden?: boolean;
  intent?: MetadataIntent;
  showName?: boolean;
  size?: 'auto' | number;
  strong?: boolean;
  text?: string;
}

export type MetadataIntent = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface MetadataFilter {
  metadata: string;
  value: string;
}
