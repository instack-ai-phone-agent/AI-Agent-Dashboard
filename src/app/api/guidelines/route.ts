// This uses file-based memory storage. Replace with DB later if needed.

let savedGuidelines: any = null;

export async function GET() {
  return Response.json(savedGuidelines || {});
}

export async function POST(req: Request) {
  const data = await req.json();
  savedGuidelines = data;
  return Response.json({ success: true });
}
