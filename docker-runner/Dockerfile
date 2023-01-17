# Published to https://hub.docker.com/r/clevercloud/clever-components-builder

FROM jenkins/inbound-agent

USER root

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

USER jenkins
