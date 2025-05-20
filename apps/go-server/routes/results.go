package routes

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/kanakkholwal/go-server/pkg/scrape"
	"github.com/kanakkholwal/go-server/utils"
)

type BulkRequest struct {
	RollNumbers []string `json:"rollNumbers"`
}

func RegisterRoutes(router fiber.Router) {

	// Register the scrape route with query rollNo
	router.Get("/scrape", func(c *fiber.Ctx) error {
		rollNo := c.Query("rollNo")
		if rollNo == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "rollNo query parameter is required"})
		}

		result, err := scrape.GetResultByRollNumber(rollNo)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(result)
	})

	// generate roll numbers route
	router.Get("/generate-roll-numbers", func(c *fiber.Ctx) error {
		batchYear := c.Query("batch")
		if batchYear == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "batchYear query parameter is required"})
		}
		// Convert batchYear to integer and should be year 2020 or greater and in YYYY format
		batchYearInt, err := strconv.Atoi(batchYear)
		if err != nil || batchYearInt < 2020 || batchYearInt > 2100 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "batchYear should be a valid year in YYYY format and greater than or equal to 2020"})
		}
		rollNumbers := utils.GenRollNumbers(batchYearInt)
		if len(rollNumbers) == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No roll numbers generated for the given batch year"})
		}
		return c.JSON(rollNumbers)
	})
	// bulk scrape
	router.Post("/bulk-scrape", func(c *fiber.Ctx) error {
		var req BulkRequest
		if err := c.BodyParser(&req); err != nil || len(req.RollNumbers) == 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input or empty rollNumbers list"})
		}

		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		results := scrape.ScrapeInBulk(ctx, req.RollNumbers, 5, 500*time.Millisecond)
		return c.JSON(results)
	})

	// scrape all batch roll numbers
	router.Post("/scrape-batch", func(c *fiber.Ctx) error {
		batchYear := c.Query("batchYear")
		if batchYear == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "batchYear query parameter is required"})
		}
		// Convert batchYear to integer and should be year 2020 or greater and in YYYY format
		// Convert batchYear to integer and should be year 2020 or greater and in YYYY format
		batchYearInt, err := strconv.Atoi(batchYear)
		if err != nil || batchYearInt < 2020 || batchYearInt > 2100 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "batchYear should be a valid year in YYYY format and greater than or equal to 2020"})
		}
		rollNumbers := utils.GenRollNumbers(batchYearInt)
		if len(rollNumbers) == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No roll numbers generated for the given batch year"})
		}

		var req BulkRequest
		req.RollNumbers = rollNumbers
		if len(req.RollNumbers) == 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input or empty rollNumbers list"})
		}

		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		results := scrape.ScrapeInBulk(ctx, rollNumbers, 30, 500*time.Millisecond)
		return c.JSON(results)
	})
	// scrape all class roll numbers
	router.Get("/scrape-class", func(c *fiber.Ctx) error {
		batchYear := c.Query("batch")
		if batchYear == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "batchYear query parameter is required"})
		}
		// Convert batchYear to integer and should be year 2020 or greater and in YYYY format
		// Convert batchYear to integer and should be year 2020 or greater and in YYYY format
		batchYearInt, err := strconv.Atoi(batchYear)
		if err != nil || batchYearInt < 2020 || batchYearInt > 2100 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "batchYear should be a valid year in YYYY format and greater than or equal to 2020"})
		}
		rollNumbers := utils.GenRollNumbers(batchYearInt)
		if len(rollNumbers) == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No roll numbers generated for the given batch year"})
		}

		var req BulkRequest
		req.RollNumbers = rollNumbers
		if len(req.RollNumbers) == 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input or empty rollNumbers list"})
		}

		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		results := scrape.ScrapeInBulk(ctx, rollNumbers, 30, 500*time.Millisecond)
		return c.JSON(results)
	})

}
