package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type UserRegLog struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error reading body: %v", err), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()
		var userReq UserRegLog
		err = json.Unmarshal(body, &userReq)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error unmarshalling body: %v", err), http.StatusBadRequest)
			return
		}

	}
}
func registerHandler(w http.ResponseWriter, r *http.Request) {

}
func homeHandler(w http.ResponseWriter, r *http.Request) {

}
func adminpanelHandler(w http.ResponseWriter, r *http.Request) {

}
func main() {
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/adminpanel", adminpanelHandler)

	http.ListenAndServe(":8080", nil)
}
