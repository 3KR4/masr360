// /app/games/[slug]/page.js
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { games } from "@/data";
import "@/styles/pages/games.css";

export default function GameDetailsPage() {
  const { slug } = useParams();

  // الحصول على اللعبة المطلوبة من المصفوفة
  const game = games.find((g) => g.id == slug.toLowerCase());

  const [current, setCurrent] = useState(0); // السؤال الحالي
  const [answers, setAnswers] = useState({}); // الإجابات التي تم اختيارها

  const total = game?.questions.length; // عدد الأسئلة في اللعبة

  // عند اختيار إجابة
  const handleSelect = (option) => {
    // لو المستخدم ضغط على نفس الإجابة المختارة بالفعل → امسحها
    if (answers[current] === option) {
      const updatedAnswers = { ...answers };
      delete updatedAnswers[current]; // نحذف الإجابة من الكائن
      setAnswers(updatedAnswers);
    } else {
      // لو ضغط على إجابة مختلفة → سجّلها
      setAnswers({ ...answers, [current]: option });
    }
  };

  // التنقل للسؤال التالي
  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };

  // التنقل للسؤال السابق
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  // عند الانتهاء من الامتحان
  const handleFinish = () => {
    let score = 0;
    game?.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const percentage = (score / total) * 100;
    const coins = Math.round((percentage / 100) * game?.reward);

    alert(`🎉 You scored ${score}/${total} — You earned ${coins} coins!`);
  };

  // حساب التقدّم بناءً على عدد الإجابات
  const answeredCount = Object.keys(answers).length;
  const progressWidth = (answeredCount / total) * 100;

  return (
    <div className="game-page single-game container">
      <div className="title-holder pages">
        <h1 className="main-title">
          <hr />
          {game?.name}
          <hr />
        </h1>
      </div>

      <div className="progress-holder">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>

        <p className="progress-text">
          {answeredCount}/{total} answers
        </p>
      </div>

      <div className="question-box">
        <div className="top">
          <h3>{game?.questions[current].question}</h3>
          <span>question {`${current < 10 ? `0` : ""}${current + 1}`}</span>

        </div>

        <div className="options">
          {game?.questions[current].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`option ${answers[current] === opt ? "selected" : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="nav-btns">
          <button
            disabled={current === 0}
            className="prev-btn main-button"
            onClick={handlePrev}
          >
            Previous
          </button>
          {current < total - 1 ? (
            <button className="next-btn main-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="finish-btn main-button" onClick={handleFinish}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
