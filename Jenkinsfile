pipeline {
  agent { label 'cc-ci-clever-components' }
  environment {
    GIT_TAG_NAME = gitTagName()
    SMART_CDN_CELLAR_KEY_ID = credentials('CELLAR_CC_COMPONENTS_ACCESS_KEY_ID')
    SMART_CDN_CELLAR_SECRET_KEY = credentials('CELLAR_CC_COMPONENTS_SECRET_ACCESS_KEY')
  }
  options {
    buildDiscarder(logRotator(daysToKeepStr: '5', numToKeepStr: '10', artifactDaysToKeepStr: '5', artifactNumToKeepStr: '10'))
  }
  stages {
    stage('build') {
      when {
        not {
          environment name: 'GIT_TAG_NAME', value: ''
        }
        beforeAgent true
      }
      steps {
        sh 'npm install'
        sh 'npm run components:build-cdn'
        sh 'npm run components:build-cdn:versions-list'
      }
    }
    stage('publish') {
      when {
        not {
          environment name: 'GIT_TAG_NAME', value: ''
        }
        beforeAgent true
      }
      steps {
        sh 'npm run components:publish-cdn'
      }
    }
  }
}

@NonCPS
String gitTagName() {
    return sh(script: 'git describe --tags --exact-match $(git rev-parse HEAD) || true', returnStdout: true)?.trim()
}
