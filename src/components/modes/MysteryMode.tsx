import React, { useState } from 'react';
import { MysteryCase, RoundResult } from '../../types/game';
import { MYSTERY_CASES } from '../../data/mysteryCases';
import { sound } from '../../lib/audio';

interface MysteryModeProps {
  onCompleteRound: (result: RoundResult) => void;
  onExit: () => void;
}

export const MysteryMode: React.FC<MysteryModeProps> = ({ onCompleteRound, onExit }) => {
  const currentCase: MysteryCase = MYSTERY_CASES[0];
  const [sceneIdx, setSceneIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [cluesUnlocked, setCluesUnlocked] = useState<number>(2);
  const [showDossier, setShowDossier] = useState<boolean>(false);
  const [score, setScore] = useState<number>(850);
  const [accuracyHits, setAccuracyHits] = useState<number>(1);
  const [totalAttempts, setTotalAttempts] = useState<number>(1);

  const scene = currentCase.scenes[sceneIdx % currentCase.scenes.length];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOptionId(optId);
  };

  const handleVerifyClue = () => {
    if (!selectedOptionId || isAnswered) return;

    setIsAnswered(true);
    const chosen = scene.options.find((o) => o.id === selectedOptionId);
    const right = !!chosen?.isCorrect;
    setIsCorrect(right);

    setTotalAttempts((prev) => prev + 1);

    if (right) {
      sound.playCorrect();
      setCluesUnlocked((prev) => Math.min(5, prev + 1));
      setScore((prev) => prev + 300);
      setAccuracyHits((prev) => prev + 1);
    } else {
      sound.playWrong();
    }
  };

  const handleNextScene = () => {
    sound.playClick();
    if (sceneIdx + 1 >= currentCase.scenes.length) {
      finishCase();
    } else {
      setSceneIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(null);
    }
  };

  const finishCase = () => {
    const accuracy = Math.round((accuracyHits / totalAttempts) * 100);
    const xpEarned = currentCase.xpReward;
    const coinsEarned = currentCase.coinReward;

    const result: RoundResult = {
      mode: 'mystery',
      score: score + 500,
      accuracy,
      correctCount: accuracyHits,
      wrongCount: totalAttempts - accuracyHits,
      maxCombo: 3,
      speedAvg: 3.2,
      xpEarned,
      coinsEarned,
      levelUp: false,
      prevLevel: 7,
      newLevel: 8,
      newUnlocks: [
        { type: 'title', name: 'Master Detective', detail: 'Solved Case #04 Heist' },
        { type: 'item', name: 'Oxford Diamond Replica', detail: `+${coinsEarned} Coins • Case Cleared` },
      ],
      learnedTakeaways: [
        {
          title: 'Narrative Urgency',
          concept: 'Differentiated "dashed frantically" vs leisurely motion verbs in literary contexts.',
          tag: 'CASE LOG #01',
        },
        {
          title: 'Past Modal Deduction',
          concept: 'Applied "must have" for logical forensic certainty vs "might have".',
          tag: 'CASE LOG #02',
        },
      ],
    };

    onCompleteRound(result);
  };

  const chosenOption = scene.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-5 gap-3.5 sm:gap-4 select-none">
      {/* 1. Case Dossier Header Bar */}
      <section className="flex flex-col w-full bg-[#1c1f2a]/95 border border-[#262a35] rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-[10px] text-[#ffb95f] uppercase tracking-wider font-bold">
              {currentCase.caseFileNumber}
            </span>
            <h2 className="font-heading text-base sm:text-lg text-[#dfe2f1] font-bold truncate">
              {currentCase.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#262a35] border border-[#313540] px-2.5 py-1 rounded-xl flex flex-col items-end">
              <span className="font-heading text-[9px] text-[#869397] uppercase">Accuracy Goal</span>
              <span className="font-heading text-xs text-[#10b981] font-bold">
                {currentCase.accuracyGoal}%+ REQUIRED
              </span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowDossier(!showDossier);
              }}
              className="p-2 rounded-xl bg-[#313540] hover:bg-[#3d4352] text-[#ffb95f] transition-colors"
              title="Open Case Dossier"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </button>
          </div>
        </div>

        {/* Scene progress & Clue counter */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262a35] text-xs">
          <span className="text-[#bcc9cd] flex items-center gap-1 font-heading">
            <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">movie</span>
            Scene {scene.sceneNumber} of {scene.totalScenes}: The Suspect Interrogation
          </span>
          <span className="font-heading text-xs font-bold text-[#ffb95f]">
            {cluesUnlocked} / 5 CLUES DISCOVERED
          </span>
        </div>
      </section>

      {/* Dossier Modal Drawer */}
      {showDossier && (
        <div className="w-full bg-[#0a0e18] border border-[#ffb95f]/40 p-4 rounded-2xl flex flex-col gap-2 shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center text-sm font-heading font-bold text-[#ffb95f]">
            <span>CASE DOSSIER // CONFIDENTIAL</span>
            <button
              onClick={() => setShowDossier(false)}
              className="text-[#869397] hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <p className="text-xs text-[#bcc9cd]">
            Suspect under investigation: <strong className="text-white">{currentCase.culpritName}</strong> ({currentCase.culpritRole}).
          </p>
          <p className="text-xs text-[#dfe2f1] italic bg-[#171b26] p-2.5 rounded-lg border border-[#262a35]">
            {currentCase.solutionNarrative}
          </p>
        </div>
      )}

      {/* 2. Suspect Testimony Stage */}
      <section className="flex flex-col w-full bg-[#1c1f2a]/95 border border-[#262a35] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl relative overflow-hidden">
        {/* Top gold crime tape accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e79400] via-[#ffb95f] to-[#571bc1]" />

        {/* Suspect ID card */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#0a0e18] border border-[#ffb95f]/40 overflow-hidden shadow-md flex-shrink-0">
            <img
              src={scene.avatarUrl}
              alt={scene.suspectName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs sm:text-sm font-bold text-[#dfe2f1]">
                {scene.suspectName}
              </span>
              <span className="px-2 py-0.2 rounded bg-[#f43f5e]/20 text-[#ffb4ab] font-heading text-[9px] font-bold uppercase">
                MOOD: {scene.suspectMood}
              </span>
            </div>
            <span className="text-xs text-[#bcc9cd]">{scene.suspectRole}</span>
          </div>
        </div>

        {/* Recorded Statement */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#0a0e18]/80 border border-[#313540] my-1 relative">
          <span className="font-heading text-[9px] text-[#ffb95f] uppercase tracking-wider block mb-1">
            RECORDED STATEMENT // INTERROGATION TAPE
          </span>
          <p className="font-serif text-xs sm:text-sm text-[#dfe2f1] leading-relaxed italic">
            {scene.dialoguePrompt.split('[BLANK]')[0]}
            <span className="inline-block px-2 py-0.5 mx-1 rounded border border-[#ffb95f] bg-[#ffb95f]/20 font-heading font-bold text-[#ffddb8]">
              {chosenOption ? chosenOption.text : '____?____'}
            </span>
            {scene.dialoguePrompt.split('[BLANK]')[1]}
          </p>
        </div>

        {/* Evidence Locker Badges */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {scene.evidenceLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 bg-[#262a35]/80 p-2.5 rounded-xl border border-[#313540]/60"
            >
              <div className="w-6 h-6 rounded bg-[#e79400]/20 text-[#ffb95f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">{log.icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-[9px] text-[#869397] uppercase">
                  {log.logCode}: {log.title}
                </span>
                <span className="text-[11px] text-[#bcc9cd] leading-tight line-clamp-2">
                  {log.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Deductive Choice Stage */}
      <section className="flex flex-col w-full bg-[#1c1f2a]/95 border border-[#262a35] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-heading text-xs sm:text-sm text-[#dfe2f1] font-bold">
            {scene.questionPrompt}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#313540] text-[#4cd7f6] font-heading text-[10px] uppercase font-bold">
            {scene.clueFocus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {scene.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            let style = 'bg-[#262a35] border-[#313540] text-[#dfe2f1] hover:border-[#ffb95f]/50';

            if (isAnswered) {
              if (isSelected && isCorrect) {
                style = 'bg-[#003640] border-[#4cd7f6] text-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.5)]';
              } else if (isSelected && !isCorrect) {
                style = 'bg-[#313540] border-[#f43f5e] text-[#ffb4ab]';
              } else if (opt.isCorrect) {
                style = 'bg-[#064e3b]/30 border-[#10b981] text-[#10b981]';
              } else {
                style = 'bg-[#171b26] border-[#1c1f2a] text-[#869397] opacity-50';
              }
            } else if (isSelected) {
              style = 'bg-[#0a0e18] border-[#ffb95f] text-[#ffddb8] shadow-[0_0_10px_rgba(255,185,95,0.3)]';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all active:translate-y-0.5 ${style}`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-heading text-xs sm:text-sm font-bold truncate">
                    “{opt.text}”
                  </span>
                  <span className="font-heading text-[9px] text-[#869397] uppercase">
                    {opt.tag}
                  </span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[18px]">
                    {isAnswered ? (isCorrect ? 'check_circle' : 'cancel') : 'radio_button_checked'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Clue Verified & Linguistic Deduction breakdown */}
      {isAnswered && chosenOption && (
        <section className="flex flex-col w-full bg-[#0a0e18] border border-[#262a35] rounded-2xl p-4 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1c1f2a]">
            <span
              className={`material-symbols-outlined text-[20px] ${
                isCorrect ? 'text-[#10b981]' : 'text-[#f43f5e]'
              }`}
            >
              {isCorrect ? 'verified' : 'crisis_alert'}
            </span>
            <span
              className={`font-heading text-sm font-bold ${
                isCorrect ? 'text-[#10b981]' : 'text-[#ffb4ab]'
              }`}
            >
              {isCorrect ? 'CLUE VERIFIED // EVIDENCE SYNCHRONIZED' : 'CONTRADICTION DETECTED'}
            </span>
          </div>

          <p className="mt-2.5 text-xs text-[#dfe2f1] leading-relaxed">
            {chosenOption.verificationText}
          </p>

          <div className="mt-2 p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] text-[11px] text-[#ffddb8]">
            <strong className="text-[#ffb95f]">Linguistic Nuance: </strong>
            {chosenOption.linguisticNote}
          </div>
        </section>
      )}

      {/* 5. Bottom Action Controls */}
      <section className="flex flex-col w-full gap-2.5">
        {!isAnswered ? (
          <button
            onClick={handleVerifyClue}
            disabled={!selectedOptionId}
            className={`w-full h-12 sm:h-13 rounded-xl font-heading text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              selectedOptionId
                ? 'bg-gradient-to-r from-[#e79400] to-[#ffb95f] text-[#472a00] shadow-[0_4px_0_#945c00] active:translate-y-0.5 cursor-pointer'
                : 'bg-[#1c1f2a] border border-[#262a35] text-[#869397] opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span>VERIFY DEDUCTIVE CLUE</span>
          </button>
        ) : (
          <button
            onClick={handleNextScene}
            className="w-full h-12 sm:h-13 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] text-[#003640] font-heading text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_#004e5c] active:translate-y-0.5 transition-all"
          >
            <span>
              {sceneIdx + 1 >= currentCase.scenes.length ? 'FINALIZE CASE ACCUSATION' : 'EXAMINE NEXT CLUE'}
            </span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        )}
      </section>
    </div>
  );
};
