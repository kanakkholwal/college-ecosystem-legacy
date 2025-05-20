package constants

type Department struct {
	Name         string   `json:"name"`
	Code         string   `json:"code"`
	Short        string   `json:"short"`
	RollKeys     []string `json:"roll_keys"`
	CoursePrefix string   `json:"course_prefix"`
	Page         string   `json:"page_url"`
}

var DepartmentsList = []Department{
	{
		Name:         "Computer Science and Engineering",
		Code:         "cse",
		Short:        "CSE",
		RollKeys:     []string{"bcs", "dcs", "mcs"},
		CoursePrefix: "CS",
		Page:         "https://nith.ac.in/computer-science-engineering",
	},
	{
		Name:         "Electronics and Communication Engineering",
		Code:         "ece",
		Short:        "ECE",
		RollKeys:     []string{"bec", "dec", "mec"},
		CoursePrefix: "EC",
		Page:         "https://nith.ac.in/electronics-communication-engineering",
	},
	{
		Name:         "Electrical Engineering",
		Code:         "ee",
		Short:        "EE",
		RollKeys:     []string{"bee", "mee"},
		CoursePrefix: "EE",
		Page:         "https://nith.ac.in/electrical-engineering",
	},
	{
		Name:         "Mechanical Engineering",
		Code:         "me",
		Short:        "ME",
		RollKeys:     []string{"bme", "mme"},
		CoursePrefix: "ME",
		Page:         "https://nith.ac.in/mechanical-engineering",
	},
	{
		Name:         "Civil Engineering",
		Code:         "ce",
		Short:        "CE",
		RollKeys:     []string{"bce", "mce"},
		CoursePrefix: "CE",
		Page:         "https://nith.ac.in/Departments/topic/130",
	},
	{
		Name:         "Chemical Engineering",
		Code:         "che",
		Short:        "CHE",
		RollKeys:     []string{"bch", "mch"},
		CoursePrefix: "CH",
		Page:         "https://nith.ac.in/chemistry",
	},
	{
		Name:         "Materials Science and Engineering",
		Code:         "mse",
		Short:        "MSE",
		RollKeys:     []string{"bms", "mms"},
		CoursePrefix: "MS",
		Page:         "https://nith.ac.in/material-science-engineering",
	},
	{
		Name:         "Mathematics & Scientific Computing",
		Code:         "mnc",
		Short:        "MNC",
		RollKeys:     []string{"bma", "mma"},
		CoursePrefix: "MA",
		Page:         "https://nith.ac.in/mathematics-scientific-computing",
	},
	{
		Name:         "Architecture",
		Code:         "arc",
		Short:        "ARC",
		RollKeys:     []string{"bar", "mar"},
		CoursePrefix: "AR",
		Page:         "https://nith.ac.in/Departments/topic/287",
	},
	{
		Name:         "Engineering Physics",
		Code:         "phy",
		Short:        "PHY",
		RollKeys:     []string{"bph", "mph"},
		CoursePrefix: "PH",
		Page:         "https://nith.ac.in/physics-photonics-science",
	},
}
