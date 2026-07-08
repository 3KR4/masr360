const ANALYTICS_URL = "https://about.api.m360travel.com/api/analytics";

async function parse(res) {
  if (res.status === "fulfilled") {
    try {
      return await res.value.json();
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET() {
  try {
    const baseUrl = ANALYTICS_URL;
    const [visitsRes, waitlistRes, gameRes, formRes, leaderRes] = await Promise.allSettled([
      fetch(`${baseUrl}/visits?page=1&limit=1`),
      fetch(`${baseUrl}/waitlist-only?page=1&limit=1`),
      fetch(`${baseUrl}/game-players?page=1&limit=1`),
      fetch(`${baseUrl}/form-submitters?page=1&limit=1`),
      fetch(`${baseUrl}/leaderboard?page=1&limit=1`),
    ]);

    const visitsData = await parse(visitsRes);
    const waitlistData = await parse(waitlistRes);
    const gameData = await parse(gameRes);
    const formData = await parse(formRes);
    const leaderData = await parse(leaderRes);

    return Response.json({
      totalVisits: visitsData?.totalVisits || visitsData?.total || 0,
      totalWaitlist: waitlistData?.total || 0,
      totalGamePlayers: gameData?.total || 0,
      totalFormSubmitters: formData?.total || 0,
      totalLeaderboard: leaderData?.total || 0,
    });
  } catch {
    return Response.json(
      { totalVisits: 0, totalWaitlist: 0, totalGamePlayers: 0, totalFormSubmitters: 0, totalLeaderboard: 0 },
      { status: 500 },
    );
  }
}
