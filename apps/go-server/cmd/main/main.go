package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// Routes
	r.HandleFunc("/", handler).Methods("GET")
	// r.HandleFunc("/result/{rollNo}", ScrapeHandler).Methods("GET")

	port := ":8080"
	log.Printf("Server is listening on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")
}
