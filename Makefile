
NAME=prixa-diagnostic-web

GCP_CONTAINER_REGISTRY?=gcr.io
GCP_PROJECT_ID?=prixa-dev
IMAGE_NAME=$(GCP_CONTAINER_REGISTRY)/$(GCP_PROJECT_ID)/$(NAME)

GIT_COMMIT=$(shell git rev-parse --short HEAD)
GIT_TAG=$(shell git describe --abbrev=0 --tags --always --match "v*")
GIT_IMPORT=gitlab.com/prixa-ai/prixa-db
CGO_ENABLED=0
BUILD_DATE=$(shell date +%s)
LDFLAGS=-X $(GIT_IMPORT).GitCommit=$(GIT_COMMIT) -X $(GIT_IMPORT).GitTag=$(GIT_TAG) -X $(GIT_IMPORT).BuildDate=$(BUILD_DATE)
IMAGE_TAG=$(GIT_TAG)-$(GIT_COMMIT)

all: build

deps:
	yarn install

build: deps
	yarn build

start:
	yarn start

test:
	yarn test

docker-build:
	docker rmi --force $(IMAGE_NAME):latest
	docker build --no-cache -t $(IMAGE_NAME):$(IMAGE_TAG) .
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(IMAGE_NAME):latest

docker-push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):latest

lint:
	yarn run lint

clean:
	rm -fr node_modules && rm -fr build

.PHONY: build clean lint docker
