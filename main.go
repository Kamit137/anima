package main

import (
	pg "anima/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type UserRegLog struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserSave struct {
	Email   string          `json:"email"`
	Save    json.RawMessage `json:"save"`
	Actions string          `json:"actions"`
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
		retValue := pg.Login(userReq.Email, userReq.Password)
		if retValue == "bad password" {
			w.WriteHeader(http.StatusUnauthorized)
		} else if retValue == "ok" {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"status":  "success",
				"message": "Пользователь вошёл",
				"email":   userReq.Email,
			})
		}
	}
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
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
		retValue := pg.Reg(userReq.Email, userReq.Password)
		if retValue == "email already in db" {
			w.WriteHeader(http.StatusUnauthorized)
		} else if retValue == "ok" {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"status":  "success",
				"message": "Пользователь зарегистрирован",
				"email":   userReq.Email,
			})
		}
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
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

		var userSave UserSave
		err = json.Unmarshal(body, &userSave)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error unmarshalling body: %v", err), http.StatusBadRequest)
			return
		}
		switch userSave.Actions {
		case "save":

			saveData := string(userSave.Save)
			pg.WriteJsonDb(saveData, userSave.Email)

			json.NewEncoder(w).Encode(map[string]string{"status": "saved"})

		case "read", "":
			save := pg.ReadJsonDb(userSave.Email)
			if save == "" {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"error": "Нет данных"})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{
					"status": "success",
					"save":   save,
				})
			}

		default:
			http.Error(w, "Unknown action", http.StatusBadRequest)
		}
	}
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
