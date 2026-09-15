import React, { useState, useEffect, useRef } from 'react';
import { WordRushQuestion, RoundResult } from '../../types/game';
import { WORD_RUSH_QUESTIONS } from '../../data/wordRushQuestions';
import { sound } from '../../lib/audio';

interface WordRushModeProps {
  onCompleteRound: (result: RoundResult) => void;
  onExit: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
}

export const WordRushMode: React.FC<WordRushModeProps> = ({
  onCompleteRound,
  onExit,
  sfxEnabled,
  onToggleSfx,
}) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Timing
  const QUESTION_TIME = 15;
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME);
  const [speedBonusAwarded, setSpeedBonusAwarded] = useState<number>(0);
  const [lastAnswerTime, setLastAnswerTime] = useState<number>(0);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const totalQuestionsInRound = Math.min(15, WORD_RUSH_QUESTIONS.length);
  const currentQ: WordRushQuestion = WORD_RUSH_QUESTIONS[questionIndex % WORD_RUSH_QUESTIONS.length];

  // Start question timer
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setIsCorrect(null);
    setSpeedBonusAwarded(0);
    questionStartTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 4) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionIndex]);

  const handleTimeOut = () => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setIsCorrect(false);
    sound.playWrong();
    setCombo(0);
    setWrongCount((prev) => prev + 1);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerLocked) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;
    setLastAnswerTime(timeTaken);
    setSelectedOption(option);
    setIsAnswerLocked(true);

    const isAnswerRight = option.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    setIsCorrect(isAnswerRight);

    if (isAnswerRight) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      sound.playCombo(newCombo);
      sound.playCorrect();

      // Points calculation
      const basePts = 100;
      const comboPts = Math.min(100, (newCombo - 1) * 20);
      const speedPts = timeTaken <= 3.5 ? 50 : timeTaken <= 6 ? 25 : 0;
      const totalEarned = basePts + comboPts + speedPts;

      setSpeedBonusAwarded(speedPts);
      setScore((prev) => prev + totalEarned);
      setCorrectCount((prev) => prev + 1);
    } else {
      setCombo(0);
      sound.playWrong();
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (isAnswerLocked) return;
    sound.playClick();
    setTimeLeft((prev) => Math.max(0, prev - 5));
    if (timeLeft <= 5) {
      handleTimeOut();
    }
  };

  const handleNextTarget = () => {
    sound.playClick();
    if (questionIndex + 1 >= totalQuestionsInRound) {
      finishRound();
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const finishRound = () => {
    const finalTotal = correctCount + wrongCount;
    const accuracy = finalTotal > 0 ? Math.round((correctCount / finalTotal) * 100) : 0;
    const xpEarned = Math.round(score * 0.15) + (accuracy >= 90 ? 100 : 50);
    const coinsEarned = Math.round(score * 0.08) + (accuracy === 100 ? 50 : 25);

    const result: RoundResult = {
      mode: 'word-rush',
      score,
      accuracy,
      correctCount,
      wrongCount,
      maxCombo,
      speedAvg: Math.round(lastAnswerTime * 10) / 10 || 1.8,
      xpEarned,
      coinsEarned,
      levelUp: false,
      prevLevel: 7,
      newLevel: 8,
      newUnlocks: [
        { type: 'title', name: 'Syntax Knight', detail: 'Equippable in Combat Passport' },
        { type: 'skill', name: 'Clause Pierce', detail: '+15% Critical on Subjunctive Mood' },
        { type: 'item', name: 'Bounty Claimed', detail: `+${coinsEarned} Coins • +${xpEarned} XP` },
      ],
      learnedTakeaways: [
        {
          title: 'Nuanced Vocabulary',
          concept: `Mastered contextual distinction for ${currentQ.answer} and related synonyms.`,
          tag: '+50 XP',
        },
        {
          title: 'Antonym Precision',
          concept: `Verified core opposites: ${currentQ.antonym || 'Contextual contrast spectrum'}.`,
          tag: 'VOCAB TELEMETRY',
        },
      ],
    };

    onCompleteRound(result);
  };

  // Timer SVG path calculation (radius = 15.9155)
  const timerPercent = (timeLeft / QUESTION_TIME) * 100;
  const strokeDashoffset = 100 - timerPercent;

  // Combo multiplier
  const multiplierText =
    combo >= 15 ? 'PERFECT RUN' : combo >= 10 ? '2.0x XP' : combo >= 5 ? '1.5x XP' : combo >= 3 ? '1.2x XP' : '1.0x XP';

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-5 gap-3.5 sm:gap-4 select-none">
      {/* 1. HUD Top Visor: Telemetry & Countdown */}
      <section className="flex flex-col w-full bg-[#1c1f2a]/95 backdrop-blur-xl border border-[#262a35] rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          {/* Round Info */}
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-[10px] sm:text-[11px] text-[#869397] uppercase tracking-wider">
              ROUND PROGRESS
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg sm:text-xl text-[#4cd7f6] font-bold">
                {String(questionIndex + 1).padStart(2, '0')}
              </span>
              <span className="font-heading text-xs sm:text-sm text-[#869397] font-semibold">
                / {totalQuestionsInRound}
              </span>
            </div>
          </div>

          {/* Live Score Badge */}
          <div className="flex flex-col items-center px-3.5 py-1 rounded-xl bg-[#262a35] border border-[#313540] shadow-inner">
            <span className="font-heading text-[9px] sm:text-[10px] text-[#ffb95f] uppercase tracking-wider">
              BATTLE PTS
            </span>
            <span className="font-heading text-base sm:text-lg text-[#ffddb8] font-bold leading-none">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Tactical Countdown Clock */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="font-heading text-[10px] text-[#ffb4ab] uppercase">TIME LEFT</span>
              <span
                className={`font-heading text-sm sm:text-base font-bold tracking-tight ${
                  timeLeft <= 4 ? 'text-[#ffb4ab] animate-pulse' : 'text-[#dfe2f1]'
                }`}
              >
                00:{timeLeft < 10 ? '0' : ''}{timeLeft}s
              </span>
            </div>
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#262a35]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className={`transition-all duration-1000 ease-linear ${
                    timeLeft <= 4 ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
                  }`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="100, 100"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#4cd7f6] absolute">
                timer
              </span>
            </div>
          </div>
        </div>

        {/* Match Progress Bar */}
        <div className="w-full bg-[#0a0e18] h-2 rounded-full mt-2.5 overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#ffb95f] rounded-full shadow-[0_0_8px_rgba(76,215,246,0.6)] transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / totalQuestionsInRound) * 100}%` }}
          />
        </div>
      </section>

      {/* 2. Combo & Multiplier Banner */}
      <section className="relative flex flex-col w-full">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#571bc1]/80 via-[#262a35]/90 to-[#571bc1]/40 border border-[#571bc1]/40 p-3 rounded-xl shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d0bcff] flex items-center justify-center text-[#3c0091] shadow-[0_0_12px_rgba(208,188,255,0.6)]">
              <span className="material-symbols-outlined text-[18px]">
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm sm:text-base text-[#d0bcff] font-bold tracking-wide">
                  {combo}x COMBO
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#e79400] text-[#563400] font-heading text-[10px] font-bold uppercase">
                  {multiplierText}
                </span>
              </div>
              <span className="text-[11px] text-[#bcc9cd] font-medium">
                {combo >= 15 ? 'MAX CHAIN ACTIVE!' : `Road to PERFECT RUN (${Math.max(0, 15 - combo)} left)`}
              </span>
            </div>
          </div>

          {/* Segmented Streak Meter */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span
                key={num}
                className={`w-2 sm:w-2.5 h-5 sm:h-6 rounded-xs transition-all duration-300 ${
                  combo >= num
                    ? 'bg-[#4cd7f6] shadow-[0_0_6px_rgba(76,215,246,0.8)]'
                    : 'bg-[#313540]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Bonus Badge */}
        {speedBonusAwarded > 0 && isAnswerLocked && (
          <div className="absolute -top-3 right-4 bg-[#ffb95f] text-[#472a00] px-2.5 py-0.5 rounded-full font-heading text-[10px] font-bold shadow-[0_0_12px_rgba(255,185,95,0.8)] flex items-center gap-1 transform -rotate-2 animate-bounce">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            +{speedBonusAwarded} SPEED BONUS!
          </div>
        )}
      </section>

      {/* 3. Challenge Stage Card */}
      <section className="flex flex-col w-full bg-[#1c1f2a]/95 border border-[#262a35] rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Top Active Conduit Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4cd7f6] via-[#d0bcff] to-[#ffb95f]" />

        {/* Card Metadata Header */}
        <div className="flex items-center justify-between mb-3 pt-1">
          <span className="px-2.5 py-1 rounded-md bg-[#313540] text-[#4cd7f6] font-heading text-[10px] uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            {currentQ.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#262a35] text-[#ffddb8] font-heading text-xs font-semibold uppercase">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Core Question Prompt */}
        <h2 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold leading-snug tracking-tight mb-3">
          {currentQ.question}
        </h2>

        {/* Sentence Clue Callout */}
        {currentQ.sentenceClue && (
          <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35] mb-4 flex items-start gap-2 shadow-inner">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px] flex-shrink-0 mt-0.5">
              format_quote
            </span>
            <p className="text-xs sm:text-sm text-[#bcc9cd] italic leading-relaxed">
              {currentQ.sentenceClue}
            </p>
          </div>
        )}

        {/* Tactile Choice Option Buttons */}
        <div className="grid grid-cols-1 gap-2.5 w-full">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedOption === option;
            const isTargetAnswer = option.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();

            let buttonStyle = 'bg-[#262a35] border-[#313540] text-[#dfe2f1] hover:border-[#4cd7f6]/50 shadow-[0_3px_0_0_#0f131d]';

            if (isAnswerLocked) {
              if (isSelected && isCorrect) {
                // Selected Correct
                buttonStyle = 'bg-[#0f131d] border-[#4cd7f6] text-[#4cd7f6] shadow-[0_3px_0_0_#004e5c,0_0_16px_rgba(76,215,246,0.35)]';
              } else if (isSelected && !isCorrect) {
                // Selected Wrong
                buttonStyle = 'bg-[#313540] border-[#f43f5e] text-[#ffb4ab] shadow-[0_3px_0_0_#93000a]';
              } else if (isTargetAnswer) {
                // Reveal Correct
                buttonStyle = 'bg-[#171b26] border-[#10b981] text-[#10b981] shadow-[0_3px_0_0_#065f46]';
              } else {
                buttonStyle = 'bg-[#171b26] border-[#1c1f2a] text-[#869397] opacity-60';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswerLocked}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all active:translate-y-0.5 text-left group ${buttonStyle}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-heading text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected && isCorrect
                        ? 'bg-[#4cd7f6] text-[#003640]'
                        : isSelected && !isCorrect
                        ? 'bg-[#f43f5e] text-white'
                        : 'bg-[#313540] text-[#bcc9cd]'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="font-heading text-sm sm:text-base font-bold truncate">
                    {option}
                  </span>
                </div>

                {/* Right side indicators */}
                <div className="flex items-center gap-2">
                  {isSelected && isCorrect && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#4cd7f6] text-[#003640] font-heading text-[10px] font-bold">
                        LOCKED
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#4cd7f6] flex items-center justify-center text-[#003640]">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    </div>
                  )}
                  {isSelected && !isCorrect && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#f43f5e] text-white font-heading text-[10px] font-bold">
                        MISSED
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#f43f5e] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </div>
                    </div>
                  )}
                  {!isAnswerLocked && (
                    <span className="font-heading text-[11px] text-[#869397] opacity-40 group-hover:opacity-100">
                      0{idx + 1}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Immediate Learning Feedback Drawer */}
      {isAnswerLocked && (
        <section className="flex flex-col w-full bg-[#0a0e18] border border-[#262a35] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1c1f2a]">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCorrect
                    ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_12px_rgba(76,215,246,0.6)]'
                    : 'bg-[#f43f5e] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCorrect ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-heading text-sm sm:text-base font-bold tracking-tight ${
                    isCorrect ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {isCorrect ? 'EXCELLENT!' : 'NOT QUITE!'}
                </span>
                <span className="font-heading text-[10px] text-[#869397] uppercase">
                  {isCorrect
                    ? `PERFECT HIT (+${100 + Math.min(100, combo * 20) + speedBonusAwarded} PTS TOTAL)`
                    : 'REVIEW TELEMETRY BELOW'}
                </span>
              </div>
            </div>

            {/* Score Breakdown Chips */}
            {isCorrect && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#1c1f2a] text-[#bcc9cd] font-heading text-[10px] font-bold">
                  +100 BASE
                </span>
                {combo > 1 && (
                  <span className="px-2 py-0.5 rounded bg-[#571bc1] text-[#d0bcff] font-heading text-[10px] font-bold">
                    +{Math.min(100, combo * 20)} COMBO
                  </span>
                )}
                {speedBonusAwarded > 0 && (
                  <span className="px-2 py-0.5 rounded bg-[#e79400] text-[#563400] font-heading text-[10px] font-bold">
                    +{speedBonusAwarded} SPEED
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Linguistic Insight Card */}
          <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35] flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-1.5 text-[#d0bcff]">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
              <span className="font-heading text-xs font-bold">Vocabulary Telemetry</span>
            </div>
            <p className="text-xs text-[#dfe2f1] leading-relaxed">
              <span className="font-semibold text-[#4cd7f6]">{currentQ.answer}</span>: {currentQ.explanation}
            </p>
            {currentQ.antonym && (
              <div className="flex items-center gap-2 mt-1 pt-1 border-t border-[#1c1f2a]">
                <span className="font-heading text-[10px] text-[#869397] uppercase font-bold">ANTONYM:</span>
                <span className="font-heading text-xs text-[#ffb4ab] font-semibold">{currentQ.antonym}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Bottom Tactical Actuator Tray */}
      <section className="flex flex-col w-full gap-2.5 pt-1">
        <div className="grid grid-cols-12 gap-2.5 items-center">
          {/* Primary Action Button */}
          <button
            onClick={isAnswerLocked ? handleNextTarget : undefined}
            disabled={!isAnswerLocked}
            className={`col-span-8 h-12 sm:h-13 rounded-xl font-heading text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_0_#004e5c] transition-all ${
              isAnswerLocked
                ? 'bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] hover:brightness-110 active:translate-y-0.5 shadow-[0_0_20px_rgba(76,215,246,0.4)] cursor-pointer'
                : 'bg-[#171b26] border border-[#262a35] text-[#869397] opacity-60 cursor-not-allowed'
            }`}
          >
            <span>{questionIndex + 1 >= totalQuestionsInRound ? 'COMPLETE ROUND' : 'NEXT TARGET'}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            disabled={isAnswerLocked}
            className="col-span-4 h-12 sm:h-13 rounded-xl bg-[#262a35] border border-[#313540] text-[#dfe2f1] font-heading text-xs sm:text-sm font-semibold flex flex-col items-center justify-center active:translate-y-0.5 shadow-[0_4px_0_0_#0f131d] transition-all disabled:opacity-50"
          >
            <span className="leading-none">SKIP</span>
            <span className="font-heading text-[10px] text-[#ffb4ab] leading-none mt-0.5">-5 SEC</span>
          </button>
        </div>

        {/* Match Utility Controls & Audio Telemetry Bar */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onToggleSfx();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1f2a] hover:bg-[#262a35] text-[#bcc9cd] font-heading text-[10px] uppercase transition-colors"
          >
            <span className={`material-symbols-outlined text-[15px] ${sfxEnabled ? 'text-[#4cd7f6]' : 'text-[#869397]'}`}>
              {sfxEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span>{sfxEnabled ? 'SFX: HYPER ON' : 'SFX: MUTED'}</span>
          </button>

          <div className="flex items-center gap-3 text-[#869397]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />
              <span className="font-heading text-[10px] text-[#4cd7f6] uppercase">SERVERS ONLINE</span>
            </div>
            <span className="font-heading text-[10px] text-[#bcc9cd] font-bold">PING: 24ms</span>
          </div>
        </div>
      </section>
    </div>
  );
};
