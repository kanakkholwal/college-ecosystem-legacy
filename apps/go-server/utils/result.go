package utils

import (
	"fmt"
	"strings"
	"time"
)

var programmeKeys = map[string][]string{
	"Dual Degree": {"dcs", "dec"},
	"B.Tech":      {"bce", "bme", "bms", "bma", "bph", "bee", "bec", "bcs", "bch"},
	"B.Arch":      {"bar"},
	"M.Tech":      {"mce", "mme", "mms", "mma", "mph", "mee", "mec", "mcs", "mch"},
}

var BranchCodesToNames = map[string]string{
	"ar": "Architecture",
	"ce": "Civil Engineering",
	"me": "Mechanical Engineering",
	"ms": "Materials Science and Engineering",
	"ma": "Mathematics and Computing",
	"ph": "Engineering Physics",
	"ee": "Electrical Engineering",
	"ec": "Electronics and Communication Engineering",
	"cs": "Computer Science and Engineering",
}

var thresholdForProgramme = map[string]int{
	"Dual Degree": 30,
	"B.Tech":      120,
	"M.Tech":      40,
	"B.Arch":      60,
}

func GenRollNumbers(batchYear int) []string {
	if batchYear < 2020 {
		return []string{}
	}
	var rollNumbers []string

	for programme, codes := range programmeKeys {
		threshold := thresholdForProgramme[programme]
		for _, code := range codes {
			for i := 1; i <= threshold; i++ {
				// Generate roll number based on the batch year and programme
				// Roll number format: YYXXXNNN, where YY is the last two digits of the batch year, XXX is the programme code, and NNN is the roll number
				// Example: 20BCE001 for B.Tech Civil Engineering, 20DEC001 for Dual Degree Electronics and Communication Engineering
				// 20BAR001 for B.Arch Architecture, 20MCE001 for M.Tech Civil Engineering
				rollNumber := fmt.Sprintf("%02d%s%03d", batchYear%100, strings.ToUpper(code), i)
				rollNumbers = append(rollNumbers, rollNumber)
			}
		}
	}

	return rollNumbers
}

func GenRollNumbersForAll() []string {

	for i := 2020; i <= time.Now().Year(); i++ {
		rollNumbers := GenRollNumbers(i)
		if len(rollNumbers) > 0 {
			return rollNumbers
		}
	}
	return []string{}

}

func GetUrlForRollNumber(rollNumber string) string {
	scheme := rollNumber[:2]
	return fmt.Sprintf("http://results.nith.ac.in/scheme%s/studentresult/result.asp", scheme)
}

func DetermineDepartment(rollNo string) string {
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

func DetermineProgramme(rollNo string) string {
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
