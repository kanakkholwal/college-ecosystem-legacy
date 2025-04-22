package scrape

import (
	"context"
	"time"

	resultTypes "github.com/kanakkholwal/go-server/types"
)

type ScrapeResult struct {
	RollNumber string                         `json:"rollNumber"`
	Data       *resultTypes.StudentHtmlParsed `json:"data,omitempty"`
	Error      string                         `json:"error,omitempty"`
}

func ScrapeInBulk(ctx context.Context, rollNumbers []string, concurrency int, delay time.Duration) []ScrapeResult {
	rolls := make(chan string)
	results := make(chan ScrapeResult)
	collected := make([]ScrapeResult, 0, len(rollNumbers))
	println("Scraping in bulk...", len(rollNumbers), "roll numbers")
	ticker := time.NewTicker(delay)
	defer ticker.Stop()

	// Start workers
	for w := 0; w < concurrency; w++ {
		go func() {
			for roll := range rolls {
				select {
				case <-ticker.C:
					data, err := GetResultByRollNumber(roll)
					res := ScrapeResult{RollNumber: roll}

					println("Scraping roll number:", roll)
					if err != nil {
						res.Error = err.Error()
					} else {
						res.Data = data
					}
					select {
					case results <- res:
					case <-ctx.Done():
						return
					}
				case <-ctx.Done():
					return
				}
			}
		}()
	}

	// Feed roll numbers
	go func() {
		for _, roll := range rollNumbers {
			select {
			case rolls <- roll:
			case <-ctx.Done():
				break
			}
		}
		close(rolls)
	}()

	// Collect results
	for i := 0; i < len(rollNumbers); i++ {
		select {
		case res := <-results:
			collected = append(collected, res)
		case <-ctx.Done():
			return collected
		}
	}
	println("Scraping completed", len(collected), "results collected")

	return collected
}
