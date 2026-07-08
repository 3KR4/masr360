const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "http://localhost:4000/api/analytics";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);
    const url = `${ANALYTICS_URL}/game-players?${params}`;
    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ entries: [], total: 0, page: 1, limit: 20, totalPages: 0 });
  }
}
