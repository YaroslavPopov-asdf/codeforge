package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"codeforge-runner/internal/sandbox"
	"codeforge-runner/internal/types"
)

type ExecuteRequest struct {
	SubjectID string          `json:"subject_id"`
	TaskID    string          `json:"task_id"`
	Code      string          `json:"code"`
	Language  string          `json:"language"`
	Spec      json.RawMessage `json:"spec"`
}

func Execute(w http.ResponseWriter, r *http.Request) {
	var req ExecuteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	var spec types.TestSpec
	if err := json.Unmarshal(req.Spec, &spec); err != nil {
		http.Error(w, `{"error":"invalid spec"}`, http.StatusBadRequest)
		return
	}

	log.Printf("Executing %s/%s (%s)", req.SubjectID, req.TaskID, req.Language)

	result, err := sandbox.Execute(sandbox.ExecuteInput{
		Code:     req.Code,
		Language: req.Language,
		Spec:     spec,
	})
	if err != nil {
		log.Printf("Execution error: %v", err)
		json.NewEncoder(w).Encode(types.ExecuteResponse{
			Passed: false,
			Errors: err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(result)
}
