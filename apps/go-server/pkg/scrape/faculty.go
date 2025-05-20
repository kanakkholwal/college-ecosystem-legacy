package scrape

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/cookiejar"
	"strings"

	"github.com/kanakkholwal/go-server/constants"

	"github.com/PuerkitoBio/goquery"
)

type Faculty struct {
	Name       string `json:"name"`
	Department string `json:"department"`
	Email      string `json:"email"`
}

func GetFacultyList() ([]string, error) {

	faculties := []Faculty{}
	// Get the list of departments

	for _, department := range constants.DepartmentsList {
		// Get the faculty list for each department
		facultyList, err := getFacultyListForDepartment(department)
		if facultyList != nil {
			faculties = append(faculties, facultyList...)
		} else {
			return nil, err
		}
	}

	return nil, errors.New("not implemented")
}

func getFacultyListForDepartment(department constants.Department) ([]Faculty, error) {
	// Create a cookie jar to store cookies
	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, err
	}

	// Create a new HTTP client with the cookie jar
	client := &http.Client{
		Jar: jar,
	}

	// Send a GET request to the department URL
	resp, err := client.Get(department.Page)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get faculty list: %s", resp.Status)
	}

	// Parse the HTML response using goquery
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	faculties := []Faculty{}

	section := doc.Find(".departmentTab#138")
	section.Find("tr").Each(func(i int, s *goquery.Selection) {
		if s.Length() < 5 {
			return
		}

		name := s.Nodes[0].FirstChild.Data
		email := strings.Split(s.Nodes[3].Data, "")[0]
		if email == "" || name == "" {
			return
		}
		faculty := Faculty{
			Name:       strings.TrimSpace(name),
			Department: department.Code,
			Email:      strings.TrimSpace(email),
		}
		faculties = append(faculties, faculty)
	})

	return faculties, nil
}
