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
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
  const [showingResult, setShowingResult] = useState<boolean>(false);

  const getButtonText = () => {
    const isLastQuestion = currentQuestion === questions.length - 1;

    if (showingResult && isLastQuestion) return t("Airdrop.continueToChooseDelagatee");
    if (showingResult) return t("Airdrop.next");
    return t("Airdrop.submit");
  };

  const getButtonAction = () => {
    const isLastQuestion = currentQuestion === questions.length - 1;

    if (showingResult && isLastQuestion) return nextStep();
    if (showingResult) return setCurrentQuestion((prev) => prev + 1);
    return setShowingResult(true);
  };

  return (
    <div className="content-modal">
      <h2>{t("Airdrop.questionNumber", { number: currentQuestion + 1 })}</h2>
      <p>{questions[currentQuestion].description}</p>
      <p>{t("Airdrop.choose")}:</p>

      <div className="quiz-answers">
        {questions[currentQuestion].answers.map((answer, index) => (
          <div className="answer" key={answer.letter} onClick={() => setSelectedAnswer(index)}>
            <p>
              {answer.letter}. {answer.description}
            </p>
          </div>
        ))}
      </div>

      <div className="buttons">
        <Button onClick={getButtonAction} bigHorizontalPadding>
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
