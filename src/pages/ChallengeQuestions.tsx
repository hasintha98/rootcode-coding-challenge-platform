import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Modal, Button, Form } from "react-bootstrap";
import {
  addCompletedQuestion,
  setTimeSpent,
} from "../store/slices/challengeSlice";
import { ChallengeService } from "../services/ChallengeService";
import { Challenge, Question } from "../types/interfaces";

const ChallengeQuestions = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { completedQuestions, timeSpent } = useSelector(
    (state: RootState) => state.challenges
  );
  const challengeId = id ? parseInt(id, 10) : 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const fetchChallenge = async () => {
    try {
      const data = await ChallengeService.fetchQuestionsByID(Number(id));
      setChallenge(data);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      setChallenge(null);
    }
  };

  useEffect(() => {
    if (id) fetchChallenge();
  }, [id]);

  useEffect(() => {
    if (selectedQuestion && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedQuestion, isSubmitted]);

  const handleAttemptClick = (question: Question) => {
    setSelectedQuestion(question);
    setSelectedOption(null);
    setTimeElapsed(0);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedOption && selectedQuestion && challengeId) {
      const correct = selectedOption === selectedQuestion.answer;
      setIsSubmitted(true);

      if (correct) {
        dispatch(
          addCompletedQuestion({
            challengeId,
            questionId: selectedQuestion.id,
            challengeTitle: challenge?.challenge || "Unknown",
            totalQuestions: challenge?.questions.length || 0,
          })
        );
        dispatch(
          setTimeSpent({
            challengeId,
            questionId: selectedQuestion.id,
            time: timeElapsed,
          })
        );
        toast.success(`Correct! Time spent: ${formatTime(timeElapsed)}`);
      } else {
        toast.error(`Incorrect! The answer is: "${selectedQuestion.answer}"`);
      }
    }
  };

  const closePopup = () => {
    setSelectedQuestion(null);
  };

  const totalQuestions = challenge?.questions.length || 0;
  const completedCount = completedQuestions.filter(
    (cq) => cq.challengeId === challengeId
  ).length;
  const progressPercentage =
    totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;
  const isFullyCompleted =
    completedCount === totalQuestions && totalQuestions > 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isQuestionCompleted = (challengeId: number, questionId: number) =>
    completedQuestions.some(
      (cq) => cq.challengeId === challengeId && cq.questionId === questionId
    );

  const getTimeSpent = (challengeId: number, questionId: number) =>
    timeSpent.find(
      (ts) => ts.challengeId === challengeId && ts.questionId === questionId
    )?.time;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        {challenge ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 font-weight-bold">{challenge.challenge}</h1>
              {isFullyCompleted && (
                <span className="badge bg-success text-white">
                  Fully Completed
                </span>
              )}
            </div>
            <p className="text-center text-muted mb-4">
              Difficulty: {challenge.level} | Language:{" "}
              {challenge.language.name}
            </p>

            <div className="mb-4">
              <div className="progress">
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <p className="text-sm text-muted mt-1">
                Progress: {completedCount} / {totalQuestions} (
                {progressPercentage.toFixed(1)}%)
              </p>
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-4">
              {challenge.questions.map((question) => (
                <div key={question.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h2 className="card-title fs-5">{question.question}</h2>
                      <p className="text-muted">
                        Time Spent:{" "}
                        {getTimeSpent(challengeId, question.id)
                          ? formatTime(getTimeSpent(challengeId, question.id)!)
                          : "N/A"}
                      </p>
                      <Button
                        onClick={() => handleAttemptClick(question)}
                        variant={
                          isQuestionCompleted(challengeId, question.id)
                            ? "secondary"
                            : "primary"
                        }
                        className="w-100"
                        disabled={isQuestionCompleted(challengeId, question.id)}
                      >
                        {isQuestionCompleted(challengeId, question.id)
                          ? "Completed"
                          : "Attempt"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted">
            Loading challenge or not found...
          </p>
        )}
      </div>

      <Modal show={!!selectedQuestion} onHide={closePopup} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedQuestion?.question}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-4">
            Time Elapsed: {formatTime(timeElapsed)}
          </p>
          <Form>
            {selectedQuestion?.options.map((option, index) => (
              <Form.Check
                key={index}
                type="radio"
                label={option}
                name="option"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                disabled={isSubmitted}
                id={`option-${index}`}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!isSubmitted ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit
            </Button>
          ) : (
            <Button variant="primary" onClick={closePopup}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChallengeQuestions;
