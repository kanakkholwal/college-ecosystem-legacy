package result

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// GetResult handles HTTP request to fetch result based on roll number
func GetResult(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	rollNo := vars["rollNo"]
	fmt.Println(rollNo)

	// Simulate fetching result (replace with actual logic)
	result := "90"

	// Respond with JSON
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"result": "%s"}`, result)
}
