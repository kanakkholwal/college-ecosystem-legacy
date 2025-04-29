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
