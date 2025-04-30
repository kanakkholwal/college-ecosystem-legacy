package constants

var ProgrammeKeys = map[string][]string{
	"Dual Degree": {"dcs", "dec"},
	"B.Tech":      {"bce", "bme", "bms", "bma", "bph", "bee", "bec", "bcs", "bch"},
	"B.Arch":      {"bar"},
	"M.Tech":      {"mce", "mme", "mms", "mma", "mph", "mee", "mec", "mcs", "mch"},
}

var SchemeKeys = map[string]string{
	"B.Tech":      "scheme",
	"Dual Degree": "dualdegree",
	"M.Tech":      "mtech",
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

var ThresholdForProgramme = map[string]int{
	"Dual Degree": 30,
	"B.Tech":      120,
	"M.Tech":      40,
	"B.Arch":      60,
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
