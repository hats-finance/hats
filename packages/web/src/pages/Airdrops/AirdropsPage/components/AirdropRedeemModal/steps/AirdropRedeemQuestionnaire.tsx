import { Button } from "components";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AirdropRedeemModalContext } from "../store";

const questions = [
  {
    description: "What is the main benefit of Hats' non-custodial approach to bug bounties and audit competitions?",
    answers: [
      { letter: "A", description: "Projects lose control over their funds." },
      { letter: "B", description: "It requires intermediaries to manage the process." },
      {
        letter: "C",
        description: "Projects gain complete control, reducing fees and embracing a pay-for-results model.",
        correct: true,
      },
      { letter: "D", description: "Projects gain complete control, reducing fees and embracing a pay-for-results model." },
    ],
  },
  {
    description:
      'What is the principle behind the "first come, first served" incentive model used in Hats Finance\'s audit competitions?',
    answers: [
      {
        letter: "A",
        description: "It ensures auditors are paid only for the first unique and valid vulnerability submission.",
        correct: true,
      },
      { letter: "B", description: "It offers equal payment to all auditors regardless of their submission time." },
      { letter: "C", description: "It increases the payment for vulnerabilities found later in the competition." },
      { letter: "D", description: "It provides bonuses for auditors who submit multiple vulnerabilities." },
    ],
  },
];

export const AirdropRedeemQuestionnaire = () => {
  const { t } = useTranslation();
  const { nextStep } = useContext(AirdropRedeemModalContext);

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showingResult, setShowingResult] = useState<boolean>(false);

  const getButtonState = () => {
    const isLastQuestion = currentQuestion === questions.length - 1;

    if (showingResult && isLastQuestion)
      return { text: t("Airdrop.continueToChooseDelagatee"), disabled: false, action: nextStep };
    if (showingResult)
      return {
        text: t("Airdrop.next"),
        disabled: false,
        action: () => {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(-1);
          setShowingResult(false);
        },
      };
    return { text: t("Airdrop.submit"), disabled: selectedAnswer === -1, action: () => setShowingResult(true) };
  };

  return (
    <div className="content-modal">
      <h2>{t("Airdrop.questionNumber", { number: currentQuestion + 1 })}</h2>
      <p>{questions[currentQuestion].description}</p>
      <p className="">{t("Airdrop.choose")}:</p>

      <div className="quiz-answers">
        {questions[currentQuestion].answers.map((answer, index) => (
          <div
            className={`answer ${index === selectedAnswer ? "selected" : ""} ${showingResult && answer.correct ? "correct" : ""}`}
            key={answer.letter}
            onClick={showingResult ? undefined : () => setSelectedAnswer(index)}
          >
            {showingResult ? (
              <>
                {answer.correct ? (
                  <span className="correctIcon">✓</span>
                ) : (
                  <>{selectedAnswer === index ? <span className="incorrectIcon">✗</span> : <>{answer.letter}.</>}</>
                )}
              </>
            ) : (
              <div>{answer.letter}.</div>
            )}
            <p>{answer.description}</p>
          </div>
        ))}
      </div>

      <div className="buttons center">
        <Button
          disabled={getButtonState().disabled}
          onClick={getButtonState().disabled ? undefined : getButtonState().action}
          bigHorizontalPadding
        >
          {getButtonState().text}
        </Button>
      </div>
    </div>
  );
};
