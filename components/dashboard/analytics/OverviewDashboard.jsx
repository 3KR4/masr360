"use client";
import React, { useState, useEffect, useCallback } from "react";
import StatsCards from "./StatsCards";
import RecentVisits from "./RecentVisits";
import WaitlistWidget from "./WaitlistWidget";
import GamePlayersWidget from "./GamePlayersWidget";
import FormSubmittersWidget from "./FormSubmittersWidget";
import LeaderboardWidget from "./LeaderboardWidget";
import FullscreenTable from "./FullscreenTable";
import { getStats, getVisits, getWaitlistOnly, getGamePlayers, getFormSubmitters, getLeaderboard } from "@/services/analytics/analytics.service";

function OverviewDashboard() {
  const [stats, setStats] = useState(null);
  const [visits, setVisits] = useState(null);
  const [waitlist, setWaitlist] = useState(null);
  const [gamePlayers, setGamePlayers] = useState(null);
  const [formSubmitters, setFormSubmitters] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [statsRes, visitsRes, waitlistRes, gameRes, formRes, leaderRes] = await Promise.allSettled([
        getStats(),
        getVisits({ page: 1, limit: 8 }),
        getWaitlistOnly({ page: 1, limit: 5 }),
        getGamePlayers({ page: 1, limit: 5 }),
        getFormSubmitters({ page: 1, limit: 5 }),
        getLeaderboard({ page: 1, limit: 5 }),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (visitsRes.status === "fulfilled") setVisits(visitsRes.value.data);
      if (waitlistRes.status === "fulfilled") setWaitlist(waitlistRes.value.data);
      if (gameRes.status === "fulfilled") setGamePlayers(gameRes.value.data);
      if (formRes.status === "fulfilled") setFormSubmitters(formRes.value.data);
      if (leaderRes.status === "fulfilled") setLeaderboard(leaderRes.value.data);

      if (
        statsRes.status === "rejected" &&
        visitsRes.status === "rejected" &&
        waitlistRes.status === "rejected" &&
        gameRes.status === "rejected" &&
        formRes.status === "rejected" &&
        leaderRes.status === "rejected"
      ) {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (fullscreen) {
    return <FullscreenTable type={fullscreen} onClose={() => setFullscreen(null)} />;
  }

  if (error && !loading) {
    return (
      <div className="analytics-error-state">
        <h3>Unable to load analytics</h3>
        <p>The analytics server is currently unavailable. Please check the connection and try again.</p>
        <button className="main-button" onClick={fetchAll}>Retry</button>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <StatsCards stats={stats} loading={loading} />
      <div className="analytics-grid-2col">
        <RecentVisits visits={visits} loading={loading} onFullscreen={() => setFullscreen("visits")} />
        <WaitlistWidget entries={waitlist} loading={loading} onFullscreen={() => setFullscreen("waitlist")} />
      </div>
      <GamePlayersWidget entries={gamePlayers} loading={loading} onFullscreen={() => setFullscreen("game-players")} />
      <div className="analytics-grid-2col">
        <LeaderboardWidget entries={leaderboard} loading={loading} onFullscreen={() => setFullscreen("leaderboard")} />
        <FormSubmittersWidget entries={formSubmitters} loading={loading} onFullscreen={() => setFullscreen("form-submitters")} />
      </div>
    </div>
  );
}

export default OverviewDashboard;
