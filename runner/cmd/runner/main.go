package main

import (
	"log"
	"net/http"
	"os"

	"codeforge-runner/internal/handler"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /execute", handler.Execute)

	addr := ":" + port
	log.Printf("Runner listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
