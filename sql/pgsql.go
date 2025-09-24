package pgsql

import (
	"database/sql"
	"fmt"
	"log"
)

func Reg(email, password string) string {
	db, err := sql.Open("postgres", "user=kamit password=1234 dbname=db sslmode=disable")
	if err != nil {
		fmt.Println("err", err)
	}
	defer db.Close()
	fmt.Println("ДБ УСПЕШНО ПОДКЛЮЧЕНА")
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT UNIQUE, password TEXT)")
	var liveEmail bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&liveEmail)
	if err != nil {
		log.Fatal(err)
	}
	if liveEmail {
		return "email already in db"
	}
	_, err = db.Exec("INSERT INTO user (email, password) VALUES($1, $2)", email, password)
	if err != nil {
		fmt.Println("err", err)
	}
	if err != nil {
		log.Fatal("Ошибка вставки данных:", err)
	}
	return "ok"
}

func login(email, password string) string {
	db, err := sql.Open("postgres", "user=kamit password=1234 dbname=db sslmode=disable")
	if err != nil {
		fmt.Println("err", err)
	}
	defer db.Close()
	fmt.Println("ДБ УСПЕШНО ПОДКЛЮЧЕНА")
	var dbpas string
	err = db.QueryRow("SELECT password FROM user WHERE email=$1)", email).Scan(&dbpas)
	if err != nil {
		fmt.Println("err", err)
	}
	if password != dbpas {
		return "bad password"
	}
	return "ok"
}

func WriteJsonInDb(jsfile struct{}) string {

}
