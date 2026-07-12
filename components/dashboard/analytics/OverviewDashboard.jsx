"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import StatsCards from "./StatsCards";
import RecentVisits from "./RecentVisits";
import WaitlistWidget from "./WaitlistWidget";
import GamePlayersWidget from "./GamePlayersWidget";
import FormSubmittersWidget from "./FormSubmittersWidget";
import LeaderboardWidget from "./LeaderboardWidget";
import QuestionsSubmitsWidget from "./QuestionsSubmitsWidget";
import QuestionsWidget from "./QuestionsWidget";
import QuestionsFullscreen from "./QuestionsFullscreen";
import FullscreenTable from "./FullscreenTable";
import { getStats, getVisits, getWaitlistOnly, getGamePlayers, getFormSubmitters, getLeaderboard, getQuestionsSubmits, getFormQuestionsSummary } from "@/services/analytics/analytics.service";

const QUESTIONS_PREVIEW_LIMIT = 10;

function OverviewDashboard() {
  const [stats, setStats] = useState(null);
  const [visits, setVisits] = useState(null);
  const [waitlist, setWaitlist] = useState(null);
  const [gamePlayers, setGamePlayers] = useState(null);
  const [formSubmitters, setFormSubmitters] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [questionsSubmits, setQuestionsSubmits] = useState(null);
  const [questionsData, setQuestionsData] = useState(null);
  const [questionsView, setQuestionsView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(null);
  // Sync state ↔ URL (pushState so back button works)
  const pushUrl = useCallback((report, question) => {
    const params = new URLSearchParams();
    if (report) params.set("report", report);
    if (question) params.set("question", question);
    const qs = params.toString();
    const url = qs ? `/dashboard?${qs}` : "/dashboard";
    window.history.pushState(null, "", url);
  }, []);

  // Sync state from URL params
  const restoreFromUrl = useCallback((data) => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("report");
    const qText = params.get("question");
    const qs = data?.questions || questionsData?.questions;
    if (r === "questions" && qText && qs) {
      const match = qs.find((q) => q.question === decodeURIComponent(qText));
      setQuestionsView(match || "list");
    } else if (r === "questions") {
      setQuestionsView("list");
    } else if (r) {
      setFullscreen(r);
    } else {
      setFullscreen(null);
      setQuestionsView(null);
    }
  }, [questionsData]);

  // Restore on mount after data loads
  const initialRestored = useRef(false);
  useEffect(() => {
    if (!questionsData || initialRestored.current) return;
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    restoreFromUrl(questionsData);
    initialRestored.current = true;
  }, [questionsData, restoreFromUrl]);

  // Listen for back/forward
  useEffect(() => {
    const onPop = () => { if (initialRestored.current) restoreFromUrl(); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [restoreFromUrl]);

  const handleFullscreen = useCallback((type) => {
    setFullscreen(type);
    if (type) pushUrl(type, null);
    else pushUrl(null, null);
  }, [pushUrl]);

  const handleCloseFullscreen = useCallback(() => {
    setFullscreen(null);
    pushUrl(null, null);
  }, [pushUrl]);

  const handleQuestionsView = useCallback((view) => {
    setQuestionsView(view);
    if (view === "list") {
      pushUrl("questions", null);
    } else if (view && typeof view === "object") {
      pushUrl("questions", encodeURIComponent(view.question));
    } else {
      pushUrl(null, null);
    }
  }, [pushUrl]);

  const handleCloseQuestions = useCallback(() => {
    setQuestionsView(null);
    pushUrl(null, null);
  }, [pushUrl]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [statsRes, visitsRes, waitlistRes, gameRes, formRes, leaderRes, questionsRes, questStatsRes] = await Promise.allSettled([
        getStats(),
        getVisits({ page: 1, limit: 7 }),
        getWaitlistOnly({ page: 1, limit: 7 }),
        getGamePlayers({ page: 1, limit: 7 }),
        getFormSubmitters({ page: 1, limit: 7 }),
        getLeaderboard({ page: 1, limit: 7 }),
        getQuestionsSubmits({ page: 1, limit: 7 }),
        getFormQuestionsSummary({ page: 1, limit: QUESTIONS_PREVIEW_LIMIT }),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (visitsRes.status === "fulfilled") setVisits(visitsRes.value.data);
      if (waitlistRes.status === "fulfilled") setWaitlist(waitlistRes.value.data);
      if (gameRes.status === "fulfilled") setGamePlayers(gameRes.value.data);
      if (formRes.status === "fulfilled") setFormSubmitters(formRes.value.data);
      if (leaderRes.status === "fulfilled") setLeaderboard(leaderRes.value.data);
      if (questionsRes.status === "fulfilled") setQuestionsSubmits(questionsRes.value.data);
      if (questStatsRes.status === "fulfilled") {
        const d = questStatsRes.value.data;
        const arr = Array.isArray(d) ? d : (d?.data || d?.questions || []);
        const total = d?.pagination?.total || d?.total || arr.length;
        setQuestionsData({ total, questions: arr });
      }

      if (
        statsRes.status === "rejected" &&
        visitsRes.status === "rejected" &&
        waitlistRes.status === "rejected" &&
        gameRes.status === "rejected" &&
        formRes.status === "rejected" &&
        leaderRes.status === "rejected" &&
        questionsRes.status === "rejected" &&
        questStatsRes.status === "rejected"
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

  if (questionsView) {
    return (
      <QuestionsFullscreen
        preSelected={questionsView === "list" ? null : questionsView}
        onClose={handleCloseQuestions}
        onQuestionSelect={(q) => {
          if (q) pushUrl("questions", encodeURIComponent(q.question));
          else pushUrl("questions", null);
        }}
      />
    );
  }

  if (fullscreen) {
    return <FullscreenTable type={fullscreen} onClose={handleCloseFullscreen} />;
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
        <RecentVisits visits={visits} loading={loading} onFullscreen={() => handleFullscreen("visits")} />
        <WaitlistWidget entries={waitlist} loading={loading} onFullscreen={() => handleFullscreen("waitlist")} />
      </div>
      <GamePlayersWidget entries={gamePlayers} loading={loading} onFullscreen={() => handleFullscreen("game-players")} />
      <div className="analytics-grid-2col">
        <LeaderboardWidget entries={leaderboard} loading={loading} onFullscreen={() => handleFullscreen("leaderboard")} />
        <FormSubmittersWidget entries={formSubmitters} loading={loading} onFullscreen={() => handleFullscreen("form-submitters")} />
      </div>
      <QuestionsSubmitsWidget entries={questionsSubmits} loading={loading} onFullscreen={() => handleFullscreen("questions-submits")} />
      <QuestionsWidget
        data={questionsData}
        loading={loading}
        onFullscreen={() => handleQuestionsView("list")}
        onQuestionClick={(q) => handleQuestionsView(q)}
      />
    </div>
  );
}

export default OverviewDashboard;
