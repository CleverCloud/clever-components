export type JenkinsInfoState = JenkinsInfoStateLoading | JenkinsInfoStateError | JenkinsInfoStateLoaded;

interface JenkinsInfoStateLoading {
  type: 'loading';
}

interface JenkinsInfoStateError {
  type: 'error';
}

interface JenkinsInfoStateLoaded {
  type: 'loaded';
  jenkinsLink: string;
  jenkinsManageLink: string;
  versions: JenkinsInfoVersions;
}


interface JenkinsInfoVersions {
  current: string;
  available: string;
}
