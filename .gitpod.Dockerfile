FROM gitpod/workspace-full

RUN sudo apt-get update \
  && sudo apt-get install -y \
  libnss3-dev \
  libatk1.0-0