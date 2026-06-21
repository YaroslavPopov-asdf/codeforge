FROM golang:1.22-alpine AS builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o runner ./cmd/runner

FROM alpine:3.21

RUN apk add --no-cache docker-cli

COPY --from=builder /app/runner /usr/local/bin/runner

EXPOSE 8080
CMD ["runner"]
