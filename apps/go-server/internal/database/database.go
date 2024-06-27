package database

import (
	"database/sql"
	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {
	connStr := "user=username dbname=dbname sslmode=disable"
	return sql.Open("postgres", connStr)
}
