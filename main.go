package main

import (
    "html/template"
    valid "anima/jsvalid"
    pg "anima/sql"

    "encoding/json"
    "fmt"
    "io"
    "net/http"
    _ "github.com/lib/pq"
)
type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
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
    if r.Method == "OPTIONS" {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")
        w.Header().Set("Access-Control-Allow-Origin", "*")

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
        w.Header().Set("Content-Type", "application/json")
	if retValue == "ok" {
		json.NewEncoder(w).Encode(Response{Success: true, Message: "Login successful"})
	} else {
		json.NewEncoder(w).Encode(Response{Success: false, Message: retValue})
	}
        }
    }


func registerHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method == "OPTIONS" {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method == "GET" {
        tmpl, err := template.ParseFiles("AnimaF/admin.html")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        tmpl.Execute(w, nil)
        return
    }

    if r.Method == "POST" {
        w.Header().Set("Content-Type", "application/json")
        w.Header().Set("Access-Control-Allow-Origin", "*")

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
        w.Header().Set("Content-Type", "application/json")
        if retValue == "ok" {
		json.NewEncoder(w).Encode(Response{Success: true, Message: "Registration successful"})
	} else {
		json.NewEncoder(w).Encode(Response{Success: false, Message: retValue})
	}
}
        }


func homeHandler(w http.ResponseWriter, r *http.Request) {

	 if r.Method == "OPTIONS" {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        w.WriteHeader(http.StatusOK)
        return
    }
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

			json.NewEncoder(w).Encode(map[string]interface{}{
				"status":  "saved",
				"message": "Data validated and saved successfully",
			})

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
	tmpl, err := template.ParseFiles("AnimaF/index.html")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    tmpl.Execute(w, nil)

}

func main() {
    http.Handle("/AnimaF/",
        http.StripPrefix("/AnimaF/",
            http.FileServer(http.Dir("AnimaF"))))
    http.Handle("/css/",
        http.StripPrefix("/css/",
            http.FileServer(http.Dir("AnimaF/css"))))
    http.Handle("/js/",
        http.StripPrefix("/js/",
            http.FileServer(http.Dir("AnimaF/js"))))

    http.HandleFunc("/login", loginHandler)
    http.HandleFunc("/admin", homeHandler)
    http.HandleFunc("/", registerHandler)
    http.HandleFunc("/screens/cart", valid.CartHandler)
    http.HandleFunc("/screens/checkout", valid.CheckoutHandler)

    http.ListenAndServe(":8080", nil)
}
