import { createTimeTable, getAllTimeTables } from "src/lib/time-table/actions";

export async function POST(request: Request) {
  const body = await request.json();
  const data = await createTimeTable(body);

  return Response.json(data);
}

export async function GET(request: Request) {
  const data = await getAllTimeTables();

  return Response.json(data);
}
