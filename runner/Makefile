.PHONY: all sandbox runner

all: sandbox runner

sandbox:
	docker build -f sandbox.Dockerfile -t codeforge-sandbox .

runner:
	docker build -f Dockerfile -t codeforge-runner .
