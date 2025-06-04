import { type NextRequest } from "next/server";



// get status of the mail server
export async function GET(request: NextRequest) {
    try {
    
        // Return a simple status message
        return new Response(
        JSON.stringify({ status: "Mail server is running" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in GET /status:", error);
        return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    
}
