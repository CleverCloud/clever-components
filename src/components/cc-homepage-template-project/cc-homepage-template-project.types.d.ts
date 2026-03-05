export type HomepageTemplateProjectState =
  | HomepageTemplateProjectStateLoaded
  | HomepageTemplateProjectStateLoading
  | HomepageTemplateProjectStateError;

export interface HomepageTemplateProjectStateLoaded {
  type: 'loaded';
  projects: TemplateProject[];
}

export interface HomepageTemplateProjectStateLoading {
  type: 'loading';
}

export interface HomepageTemplateProjectStateError {
  type: 'error';
}

export interface TemplateProject {
  name: string;
  description: string;
  href: string;
}
