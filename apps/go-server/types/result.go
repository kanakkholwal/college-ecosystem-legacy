package types

type StudentResult struct {
	RollNumber      string           `json:"rollNo"`
	Name            string           `json:"name"`
	FathersName     string           `json:"fatherName"`
	SemesterResults []SemesterResult `json:"semesters"`
	CGPI            float64          `json:"cgpi"`
	Branch          string           `json:"branch"`
	Batch           int              `json:"batch"`
	Programme       string           `json:"programme"`
}

type Rank struct {
	ClassRank   int64 `json:"class"`
	YearRank    int64 `json:"year"`
	BranchRank  int64 `json:"branch"`
	CollegeRank int64 `json:"college"`
}
type StudentResultWithRanks struct {
	RollNumber  string  `json:"rollNo"`
	Name        string  `json:"name"`
	FathersName string  `json:"fatherName"`
	CGPI        float64 `json:"cgpi"`
	Branch      string  `json:"branch"`
	Batch       string  `json:"batch"`
	Programme   string  `json:"programme"`
	Rank        Rank    `json:"rank"`
}

type SemesterResult struct {
	SemesterNumber int64           `json:"semester"`
	SubjectResults []SubjectResult `json:"courses"`
	SGPI           float64         `json:"sgpi"`
	CGPI           float64         `json:"cgpi"`
	SGPITotal      int64           `json:"sgpi_total"`
	CGPITotal      int64           `json:"cgpi_total"`
}

type SubjectResult struct {
	SubjectName string  `json:"name"`
	SubjectCode string  `json:"code"`
	Credit      int64   `json:"credit"`
	Grade       string  `json:"grade"`
	Points      int64   `json:"points"`
	CGPI        float64 `json:"cgpi"`
}

type StudentHtmlParsed struct {
	RollNumber      string           `json:"rollNo"`
	Name            string           `json:"name"`
	FathersName     string           `json:"fatherName"`
	SemesterResults []SemesterResult `json:"semesters"`
	CGPI            float64          `json:"cgpi"`
	Programme       string           `json:"programme"`
	Branch          string           `json:"branch"`
	Batch           int              `json:"batch"`
}
