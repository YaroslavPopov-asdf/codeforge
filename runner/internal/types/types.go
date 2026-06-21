package types

type TestCase struct {
	Name            string `json:"name"`
	Stdin           string `json:"stdin"`
	ExpectedStdout  string `json:"expected_stdout"`
	ExpectedExitCode int   `json:"expected_exit_code"`
}

type TestSpec struct {
	Type    string     `json:"type"`
	Timeout int        `json:"timeout"`
	Cases   []TestCase `json:"cases"`
}

type ExecuteResponse struct {
	Passed      bool         `json:"passed"`
	Output      string       `json:"output"`
	Errors      string       `json:"errors"`
	TestResults []TestResult `json:"testResults"`
}

type TestResult struct {
	Name   string `json:"name"`
	Passed bool   `json:"passed"`
	Output string `json:"output"`
}
