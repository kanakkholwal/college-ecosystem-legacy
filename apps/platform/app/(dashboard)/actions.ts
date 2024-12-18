"use server";
import HTMLParser from "node-html-parser";

type  announcementsType= {
    title: string;
    link: string;
    new: boolean;
}[]

export async function getLatestAnnouncements(): Promise<announcementsType> {
  const announcements_url = "https://nith.ac.in/all-announcements";

  try {
    //  cache the fetch response
    const response = await fetch(announcements_url,{
        headers: {
            "Cache-Control": "max-age=3600",
        },
    });
    const data = await response.text();
    const document = HTMLParser.parse(data);
    const tbody = document.querySelector("tbody");
    if (!tbody) return []
    const rows = tbody.querySelectorAll("tr") as unknown as HTMLElement[];
    const announcements = [];
    for (const row of rows) {
      const td = row.querySelector("td:nth-child(2)") as unknown as HTMLElement;
  
      announcements.push({
        title: td.innerText,
        link: td.querySelector("a")?.getAttribute("href") || "",
        new: !!td.querySelector(".newIcon"),
       });
    }
    return Promise.resolve(announcements);

  } catch (error) {
    console.error("Error fetching GIF:", error);
    return []
  }
}

// Random quote generator function
export async function getRandomQuote(): Promise<{ content: string; author: string }> {
    try {
      const response = await fetch(
        "https://api.quotable.io/quotes/random?limit=1&maxLength=100"
      );
      const data = await response.json();
      return { content: data[0].content, author: data[0].author };
    } catch (error) {
      console.error("Error fetching quote:", error);
      return {
        content: "The best way to predict the future is to create it.",
        author: "Peter Drucker",
      };
    }
  }
  