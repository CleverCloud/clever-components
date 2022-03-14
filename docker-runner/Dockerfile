# Published to https://hub.docker.com/r/clevercloud/clever-components-builder

FROM jenkins/jnlp-slave

USER root

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

USER jenkins
