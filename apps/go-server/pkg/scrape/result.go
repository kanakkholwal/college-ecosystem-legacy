package scrape

import (
	"context"
	"fmt"

	"io"
	"net/http"

	urlpkg "net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type Semester struct {
	Semester  string
	SGPI      float64
	SGPITotal float64
	CGPI      float64
	CGPITotal float64
	Courses   []Course
}

type Course struct {
	Name string
	Code string
	CGPI float64
}

type RawResult struct {
	Name      string
	RollNo    string
	Branch    string
	Batch     int
	Programme string
	Semesters []Semester
	Gender    string
}

type HeaderInfo struct {
	URL                      string
	Referer                  string
	CSRFToken                string
	RequestVerificationToken string
}

var headerMap = map[string]HeaderInfo{
	"20": {
		URL:                      "http://results.nith.ac.in/scheme20/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme20/studentresult/index.asp",
		CSRFToken:                "{782F96DF-5115-4492-8CB2-06104ECFF0CA}",
		RequestVerificationToken: "094D0BF7-EE18-E102-8CBF-23C329B32E1C",
	},
	"21": {
		URL:                      "http://results.nith.ac.in/scheme2021/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme2021/studentresult/index.asp",
		CSRFToken:                "{4CFC8412-697D-4F3E-9A36-74947F9E04BB}",
		RequestVerificationToken: "AA2E4F5C-48DC-49D6-A9CE-9DDE703F6AD4",
	},
	"21_dual": {
		URL:                      "http://results.nith.ac.in/dualdegree21/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/dualdegree21/studentresult/index.asp",
		CSRFToken:                "{BC8FDC16-3133-429F-8FD7-CAC7026512F1}",
		RequestVerificationToken: "13FD6203-F8C9-FBC3-877F-3D7480CF2325",
	},
	"22": {
		URL:                      "http://results.nith.ac.in/scheme2022/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme2022/studentresult/index.asp",
		CSRFToken:                "{D9C7E347-A5E4-4E52-96FB-7DBB2492D3D5}",
		RequestVerificationToken: "E3449E57-AB26-4125-BD1E-1D94F2A5A4D8",
	},
	"23": {
		URL:                      "http://results.nith.ac.in/scheme23/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme23/studentresult/index.asp",
		CSRFToken:                "{F1E16363-FEDA-48AF-88E9-8A186425C213}",
		RequestVerificationToken: "4FFEE8F3-14C9-27C4-B370-598406BF99C1",
	},
	"24": {
		URL:                      "http://results.nith.ac.in/scheme24/studentresult/result.asp",
		Referer:                  "http://results.nith.ac.in/scheme24/studentresult/index.asp",
		CSRFToken:                "{0696D16E-58AD-472B-890E-6537BE62A5EA}",
		RequestVerificationToken: "F797B72F-DC73-D06D-6B19-012ED5EBA98B",
	},
}

func fetchData(url, rollNo string, headers map[string]string) (string, error) {
	data := urlpkg.Values{}
	data.Set("RollNumber", rollNo)
	data.Set("CSRFToken", headers["CSRFToken"])
	data.Set("RequestVerificationToken", headers["RequestVerificationToken"])
	data.Set("B1", "Submit")

	req, err := http.NewRequest("POST", url, strings.NewReader(data.Encode()))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Referer", headers["Referer"])
	// Add other necessary headers as needed

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("invalid roll number")
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(bodyBytes), nil
}

type Subject struct {
	Code   string `json:"code"`
	Name   string `json:"name"`
	Grade  string `json:"grade"`
	Credit string `json:"credit"`
}

// SemesterResult holds the result of a semester.
type SemesterResult struct {
	Semester   string    `json:"semester"`
	Cgpi       string    `json:"cgpi"`
	Sgpi       string    `json:"sgpi"`
	TotalCreds string    `json:"totalCredits"`
	Courses    []Subject `json:"courses"`
}

// scrapeResult parses the result HTML and extracts all semester data.
func scrapeResult(ctx context.Context, html string) ([]SemesterResult, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %w", err)
	}

	var results []SemesterResult

	doc.Find("table.MsoNormalTable").Each(func(i int, s *goquery.Selection) {
		// Skip unrelated tables
		if s.Find("tr").Length() < 3 {
			return
		}

		text := s.Text()
		if !strings.Contains(text, "Subject Code") {
			return
		}

		// Get semester title
		semesterHeader := s.PrevAllFiltered("p").First().Text()
		semesterHeader = strings.TrimSpace(semesterHeader)

		// Initialize semester result
		semester := SemesterResult{
			Semester: semesterHeader,
			Courses:  []Subject{},
		}

		// Parse courses from table rows (skip header)
		s.Find("tr").Each(func(i int, tr *goquery.Selection) {
			if i == 0 {
				return
			}
			tds := tr.Find("td")
			if tds.Length() < 4 {
				return
			}
			course := Subject{
				Code:   strings.TrimSpace(tds.Eq(0).Text()),
				Name:   strings.TrimSpace(tds.Eq(1).Text()),
				Grade:  strings.TrimSpace(tds.Eq(2).Text()),
				Credit: strings.TrimSpace(tds.Eq(3).Text()),
			}
			semester.Courses = append(semester.Courses, course)
		})

		// Find SGPI, CGPI, and total credits in sibling paragraphs
		siblings := s.NextUntil("table")
		siblings.Each(func(_ int, p *goquery.Selection) {
			text := strings.TrimSpace(p.Text())
			if strings.Contains(text, "SGPI") {
				fmt.Sscanf(text, "SGPI : %s CGPI : %s Total Credits Earned : %s", &semester.Sgpi, &semester.Cgpi, &semester.TotalCreds)
			}
		})

		results = append(results, semester)
	})

	if len(results) == 0 {
		return nil, fmt.Errorf("no results found in HTML")
	}

	return results, nil
}

func determineDepartment(rollNo string) string {
	rollNo = strings.ToLower(rollNo)
	switch {
	case strings.Contains(rollNo, "bar"):
		return "Architecture"
	case strings.Contains(rollNo, "bce"):
		return "Civil Engineering"
	case strings.Contains(rollNo, "bme"):
		return "Mechanical Engineering"
	case strings.Contains(rollNo, "bms"):
		return "Materials Science and Engineering"
	case strings.Contains(rollNo, "bma"):
		return "Mathematics and Computing"
	case strings.Contains(rollNo, "bph"):
		return "Engineering Physics"
	case strings.Contains(rollNo, "bee"):
		return "Electrical Engineering"
	case strings.Contains(rollNo, "bec"), strings.Contains(rollNo, "dec"):
		return "Electronics and Communication Engineering"
	case strings.Contains(rollNo, "bcs"), strings.Contains(rollNo, "dcs"):
		return "Computer Science and Engineering"
	case strings.Contains(rollNo, "bch"):
		return "Chemical Engineering"
	default:
		return "Unknown"
	}
}

func determineProgramme(rollNo string) string {
	programmeCode := strings.ToLower(rollNo[2:5])
	programmeKeys := map[string][]string{
		"Dual Degree": {"dcs", "dec"},
		"B.Tech":      {"bce", "bme", "bms", "bma", "bph", "bee", "bec", "bcs", "bch"},
		"B.Arch":      {"bar"},
		"M.Tech":      {"mce", "mme", "mms", "mma", "mph", "mee", "mec", "mcs", "mch"},
	}

	for programme, codes := range programmeKeys {
		for _, code := range codes {
			if code == programmeCode {
				return programme
			}
		}
	}

	return "Unknown"
}

func GetResult(rollNo string) (RawResult, error) {

	headers, ok := headerMap[rollNo[:2]]
	if !ok {
		return RawResult{}, fmt.Errorf("unsupported roll number format")
	}

	htmlContent, err := fetchData(headers.URL, rollNo, map[string]string{
		"Referer":                  headers.Referer,
		"CSRFToken":                headers.CSRFToken,
		"RequestVerificationToken": headers.RequestVerificationToken,
	})
	if err != nil {
		return RawResult{}, err
	}

	semesters, err := scrapeResult(context.Background(), htmlContent)
	if err != nil {
		return RawResult{}, err
	}

	resultInfo := RawResult{
		RollNo:    rollNo,
		Branch:    determineDepartment(rollNo),
		Batch:     2020,
		Programme: determineProgramme(rollNo),
		Semesters: []Semester{},
	}

	for _, semesterResult := range semesters {
		semester := Semester{
			Semester:  semesterResult.Semester,
			SGPI:      0, // Assign appropriate values if available
			SGPITotal: 0,
			CGPI:      0,
			CGPITotal: 0,
			Courses:   []Course{},
		}
		for _, subject := range semesterResult.Courses {
			course := Course{
				Name: subject.Name,
				Code: subject.Code,
				CGPI: 0, // Assign appropriate values if available
			}
			semester.Courses = append(semester.Courses, course)
		}
		resultInfo.Semesters = append(resultInfo.Semesters, semester)
	}

	return resultInfo, nil
}
