package sandbox

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"codeforge-runner/internal/types"
	"github.com/google/uuid"
)

type ExecuteInput struct {
	Code     string
	Language string
	Spec     types.TestSpec
}

const sandboxImage = "codeforge-sandbox"

func workDirBase() string {
	dir := os.Getenv("CF_WORK_DIR")
	if dir == "" {
		dir = "/tmp/cf-runner"
	}
	return dir
}

func dockerArgs(workDir string) []string {
	return []string{
		"run", "--rm",
		"--network", "none",
		"--memory", "256m",
		"--cpus", "1",
		"-v", workDir + ":/work",
		"-w", "/work",
		sandboxImage,
	}
}

func Execute(input ExecuteInput) (types.ExecuteResponse, error) {
	workDir := filepath.Join(workDirBase(), "cf-"+uuid.New().String())
	if err := os.MkdirAll(workDir, 0755); err != nil {
		return types.ExecuteResponse{}, fmt.Errorf("create work dir: %w", err)
	}
	defer os.RemoveAll(workDir)

	ext := map[string]string{
		"c":    "c",
		"cpp":  "cpp",
		"rust": "rs",
	}[input.Language]
	if ext == "" {
		ext = "c"
	}

	srcFile := filepath.Join(workDir, "solution."+ext)
	if err := os.WriteFile(srcFile, []byte(input.Code), 0644); err != nil {
		return types.ExecuteResponse{}, fmt.Errorf("write source: %w", err)
	}

	args := dockerArgs(workDir)

	var compileCmd []string
	switch input.Language {
	case "c":
		compileCmd = []string{"gcc", "-Wall", "-Wextra", "-std=c99", "-o", "solution", "solution.c"}
	case "cpp":
		compileCmd = []string{"g++", "-Wall", "-Wextra", "-std=c++17", "-o", "solution", "solution.cpp"}
	case "rust":
		compileCmd = []string{"rustc", "-o", "solution", "solution.rs"}
	default:
		return types.ExecuteResponse{}, fmt.Errorf("unsupported language: %s", input.Language)
	}

	fullArgs := append(args, compileCmd...)
	var compileBuf bytes.Buffer
	cmd := exec.Command("docker", fullArgs...)
	cmd.Stdout = &compileBuf
	cmd.Stderr = &compileBuf
	if err := cmd.Run(); err != nil {
		return types.ExecuteResponse{
			Passed: false,
			Output: compileBuf.String(),
			Errors: compileBuf.String(),
		}, nil
	}
	compileOutput := compileBuf.String()

	binaryPath := filepath.Join(workDir, "solution")
	if _, err := os.Stat(binaryPath); err != nil {
		return types.ExecuteResponse{
			Passed: false,
			Output: "",
			Errors: fmt.Sprintf("compilation failed: binary not created\n%s", compileOutput),
		}, nil
	}

	var results []types.TestResult
	for _, tc := range input.Spec.Cases {
		runArgs := append(args, "./solution")
		cmd := exec.Command("docker", runArgs...)
		cmd.Stdin = strings.NewReader(tc.Stdin)
		var outBuf, errBuf bytes.Buffer
		cmd.Stdout = &outBuf
		cmd.Stderr = &errBuf

		if err := cmd.Run(); err != nil {
			results = append(results, types.TestResult{
				Name:   tc.Name,
				Passed: false,
				Output: fmt.Sprintf("Ошибка выполнения: %v\n%s", err, errBuf.String()),
			})
			continue
		}

		actual := outBuf.String()
		passed := actual == tc.ExpectedStdout
		resultOutput := ""
		if !passed {
			resultOutput = fmt.Sprintf("Вывод программы:\n%s", actual)
		}
		results = append(results, types.TestResult{
			Name:   tc.Name,
			Passed: passed,
			Output: resultOutput,
		})
	}

	allPassed := true
	for _, r := range results {
		if !r.Passed {
			allPassed = false
			break
		}
	}

	return types.ExecuteResponse{
		Passed:      allPassed,
		Output:      compileOutput,
		TestResults: results,
	}, nil
}
