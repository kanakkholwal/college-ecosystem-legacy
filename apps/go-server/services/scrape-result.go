package scrape_result

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

// ScrapedResult defines the structure of the scraped data
type ScrapedResult struct {
	Name      string     `json:"name"`
	RollNo    string     `json:"rollNo"`
	Branch    string     `json:"branch"`
	Batch     int        `json:"batch"`
	Programme string     `json:"programme"`
	Semesters []Semester `json:"semesters"`
}

// Semester defines the structure of a semester's data
type Semester struct {
	Semester  int      `json:"semester"`
	SGPI      float64  `json:"sgpi"`
	SGPITotal float64  `json:"sgpi_total"`
	CGPI      float64  `json:"cgpi"`
	CGPITotal float64  `json:"cgpi_total"`
	Courses   []Course `json:"courses"`
}

// Course defines the structure of a course's data
type Course struct {
	Name string  `json:"name"`
	Code string  `json:"code"`
	CGPI float64 `json:"cgpi"`
}

func ScrapeHandler(w http.ResponseWriter, r *http.Request) {
	rollNo := r.URL.Query().Get("rollNo")
	if rollNo == "" {
		http.Error(w, "Roll No is required", http.StatusBadRequest)
		return
	}

	result, err := ScrapeResult(rollNo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error scraping result: %v", err), http.StatusInternalServerError)
		return
	}

	// Marshal result to JSON
	jsonData, err := json.Marshal(result)
	if err != nil {
		http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
		return
	}

	// Set Content-Type header and write response
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func ScrapeResult(rollNo string) (*ScrapedResult, error) {
	info := getInfo(rollNo)

	// Prepare POST data
	data := fmt.Sprintf("RollNumber=%s&CSRFToken=%s&RequestVerificationToken=%s&B1=Submit",
		rollNo, info.Headers["CSRFToken"], info.Headers["RequestVerificationToken"])

	// Perform POST request
	url := info.URL
	response, err := http.Post(url, "application/x-www-form-urlencoded", bytes.NewBufferString(data))
	if err != nil {
		return nil, fmt.Errorf("failed to fetch data: %v", err)
	}
	defer response.Body.Close()

	// Check response status
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid response status: %v", response.Status)
	}

	// Parse HTML response
	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %v", err)
	}

	// Validate result
	if doc.Find("#page-wrap").Length() == 0 {
		return nil, fmt.Errorf("invalid Roll No")
	}

	// Parse and extract data
	result := ScrapedResult{
		Name:      doc.Find("table").Eq(1).Find("td:nth-child(2) > p:nth-child(2)").Text(),
		RollNo:    rollNo,
		Branch:    info.Branch,
		Batch:     info.Batch,
		Programme: info.Programme,
		Semesters: []Semester{},
	}

	// Remove unnecessary element
	doc.Find(".pagebreak").Remove()

	// Parse semester data
	doc.Find("table:nth-child(odd):nth-child(n+3):not(:last-of-type)").Each(func(index int, table *goquery.Selection) {
		semester := Semester{
			Semester: index + 1,
			Courses:  []Course{},
		}
		table.Find("tr:not([class])").Each(func(i int, tr *goquery.Selection) {
			cgpiStr := tr.Find("td:nth-child(6)").Text()
			semesterTotalStr := tr.Find("td:nth-child(4)").Text()

			cgpi, _ := strconv.ParseFloat(cgpiStr, 64)
			semesterTotal, _ := strconv.ParseFloat(semesterTotalStr, 64)

			semester.Courses = append(semester.Courses, Course{
				Name: tr.Find("td:nth-child(2)").Text(),
				Code: tr.Find("td:nth-child(3)").Text(),
				CGPI: cgpi / semesterTotal,
			})
		})
		result.Semesters = append(result.Semesters, semester)
	})

	// Parse result data
	doc.Find("table:nth-child(even):nth-child(n+3):not(:last-of-type)").Each(func(index int, table *goquery.Selection) {
		tds := table.Find("td")
		if tds.Length() >= 5 {
			semesterIndex := index % len(result.Semesters)
			semester := &result.Semesters[semesterIndex]

			semester.SGPI, _ = strconv.ParseFloat(tds.Eq(1).Text(), 64)
			semester.SGPITotal, _ = strconv.ParseFloat(tds.Eq(2).Text(), 64)
			semester.CGPI, _ = strconv.ParseFloat(tds.Eq(3).Text(), 64)
			semester.CGPITotal, _ = strconv.ParseFloat(tds.Eq(4).Text(), 64)
		}
	})

	return &result, nil
}

type HeaderMap map[int]struct {
	URL                      string `json:"url"`
	Referer                  string `json:"Referer"`
	CSRFToken                string `json:"CSRFToken"`
	RequestVerificationToken string `json:"RequestVerificationToken"`
}

var headerMap = HeaderMap{
	20: {
		URL:                      "http://results.nith.ac.in/scheme20/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme20/studentresult/index.asp",
		CSRFToken:                "{782F96DF-5115-4492-8CB2-06104ECFF0CA}",
		RequestVerificationToken: "094D0BF7-EE18-E102-8CBF-23C329B32E1C",
	},
	21: {
		URL:                      "http://results.nith.ac.in/scheme21/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme21/studentresult/index.asp",
		CSRFToken:                "{D5D50B24-2DDE-4C35-9F41-10426C59EEA7}",
		RequestVerificationToken: "7BA3D112-507E-5379-EE25-9539F0DE9076",
	},
	22: {
		URL:                      "http://results.nith.ac.in/scheme22/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme22/studentresult/index.asp",
		CSRFToken:                "{AF6DB03B-F6EC-475E-B331-6C9DE3846923}",
		RequestVerificationToken: "DA92D62F-BF6E-B268-4E04-F419F5EA6233",
	},
	23: {
		URL:                      "http://results.nith.ac.in/scheme23/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme23/studentresult/index.asp",
		CSRFToken:                "{F1E16363-FEDA-48AF-88E9-8A186425C213}",
		RequestVerificationToken: "4FFEE8F3-14C9-27C4-B370-598406BF99C1",
	},
}

func getInfo(rollNo string) *Info {
	// Determine batch, branch, URL, and headers based on roll number
	// Implement your logic here to determine these values dynamically or based on a mapping
	// For simplicity, using static values as in TypeScript example
	batch := 20
	branch := determineDepartment(rollNo)
	url := headerMap[batch].URL
	headers := map[string]string{
		"Referer":                  headerMap[batch].Referer,
		"CSRFToken":                headerMap[batch].CSRFToken,
		"RequestVerificationToken": headerMap[batch].RequestVerificationToken,
	}
	programme := determineProgramme(rollNo)

	return &Info{
		Batch:     batch,
		Branch:    branch,
		URL:       url,
		Headers:   headers,
		Programme: programme,
	}
}

func determineDepartment(rollNo string) string {
	// Implement your logic to determine department based on roll number
	// Example implementation, adjust as per your requirements
	switch {
	case containsAny(rollNo, "bar"):
		return "Architecture"
	case containsAny(rollNo, "bce"):
		return "Civil Engineering"
	case containsAny(rollNo, "bme"):
		return "Mechanical Engineering"
	// Add more cases as needed
	default:
		return "Unknown"
	}
}

func determineProgramme(rollNo string) string {
	// Implement your logic to determine programme based on roll number
	// Example implementation, adjust as per your requirements
	switch {
	case containsAny(rollNo, "dcs", "dec"):
		return "Dual Degree"
	case containsAny(rollNo, "bar"):
		return "B.Arch"
	default:
		return "B.Tech"
	}
}

// Utility function to check if the string contains any of the substrings
func containsAny(s string, substrs ...string) bool {
	for _, substr := range substrs {
		if strings.Contains(s, substr) {
			return true
		}
	}
	return false
}

// Info struct to hold scraping information
type Info struct {
	Batch     int
	Branch    string
	URL       string
	Headers   map[string]string
	Programme string
}
