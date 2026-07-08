const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "http://localhost:4000/api/analytics";

export async function GET() {
  try {
    if (!ANALYTICS_URL) {
      return Response.json({
        totalVisits: 0,
        uniqueVisitors: 0,
        totalWaitlist: 0,
        totalGamePlayers: 0,
        totalFormSubmitters: 0,
        totalLeaderboardEntries: 0,
      });
    }

    const baseUrl = ANALYTICS_URL;

    const [visitsRes, waitlistRes, gameRes, formRes, leaderRes] = await Promise.allSettled([
      fetch(`${baseUrl}/visits?page=1&limit=1`),
      fetch(`${baseUrl}/waitlist-only?page=1&limit=1`),
      fetch(`${baseUrl}/game-players?page=1&limit=1`),
      fetch(`${baseUrl}/form-submitters?page=1&limit=1`),
      fetch(`${baseUrl}/leaderboard?page=1&limit=1`),
    ]);

    const parse = async (res) => {
      if (res.status === "fulfilled" && res.value.ok) {
        const data = await res.value.json();
        return data;
      }
      return { total: 0, totalVisits: [] };
    };

    const visitsData = await parse(visitsRes);
    const waitlistData = await parse(waitlistRes);
    const gameData = await parse(gameRes);
    const formData = await parse(formRes);
    const leaderData = await parse(leaderRes);

    const totalVisits = visitsData.totalVisits?.[0]?.totalVisits || 0;

    return Response.json({
      totalVisits,
      uniqueVisitors: visitsData.total || 0,
      totalWaitlist: waitlistData.total || 0,
      totalGamePlayers: gameData.total || 0,
      totalFormSubmitters: formData.total || 0,
      totalLeaderboardEntries: leaderData.total || 0,
    });
  } catch {
    return Response.json({
      totalVisits: 0,
      uniqueVisitors: 0,
      totalWaitlist: 0,
      totalGamePlayers: 0,
      totalFormSubmitters: 0,
      totalLeaderboardEntries: 0,
    });
  }
}
