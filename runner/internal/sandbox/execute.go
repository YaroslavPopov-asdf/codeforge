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

func Execute(input ExecuteInput) (types.ExecuteResponse, error) {
	workDir := filepath.Join(os.TempDir(), "cf-"+uuid.New().String())
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

	binary := filepath.Join(workDir, "solution")
	var compileCmd *exec.Cmd

	switch input.Language {
	case "c":
		compileCmd = exec.Command("gcc", "-Wall", "-Wextra", "-std=c99", "-o", binary, srcFile)
	case "cpp":
		compileCmd = exec.Command("g++", "-Wall", "-Wextra", "-std=c++17", "-o", binary, srcFile)
	case "rust":
		compileCmd = exec.Command("rustc", "-o", binary, srcFile)
	default:
		return types.ExecuteResponse{}, fmt.Errorf("unsupported language: %s", input.Language)
	}

	var compileOut bytes.Buffer
	compileCmd.Stdout = &compileOut
	compileCmd.Stderr = &compileOut

	if err := compileCmd.Run(); err != nil {
		return types.ExecuteResponse{
			Passed: false,
			Output: compileOut.String(),
			Errors: compileOut.String(),
		}, nil
	}

	var results []types.TestResult
	for _, tc := range input.Spec.Cases {
		var outBuf, errBuf bytes.Buffer
		cmd := exec.Command(binary)
		cmd.Stdin = strings.NewReader(tc.Stdin)
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
			resultOutput = fmt.Sprintf("Ожидалось: %q\nПолучено: %q", tc.ExpectedStdout, actual)
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
		Output:      compileOut.String(),
		TestResults: results,
	}, nil
}
