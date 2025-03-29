import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CompletedChallenge } from "../types/interfaces";

const CompletedChallengesModal: React.FC<{
  onClose: () => void;
  show: boolean;
}> = ({ onClose, show }) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { completedQuestions, timeSpent } = useSelector(
    (state: RootState) => state.challenges
  );

  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallenge[]
  >([]);

  const sortedChallenges = [...completedChallenges].sort((a, b) =>
    sortOrder === "asc" ? a.totalTime - b.totalTime : b.totalTime - a.totalTime
  );

  const updateCompletedChallenges = async () => {
    const challengeMap = new Map<
      number,
      { title: string; count: number; totalQuestions: number }
    >();
    completedQuestions.forEach(
      ({ challengeId, challengeTitle, totalQuestions }) => {
        const entry = challengeMap.get(challengeId) || {
          title: challengeTitle,
          count: 0,
          totalQuestions,
        };
        challengeMap.set(challengeId, { ...entry, count: entry.count + 1 });
      }
    );

    const newChallenges = Array.from(challengeMap.entries())
      .filter(([, { count, totalQuestions }]) => count === totalQuestions)
      .map(([id, { title }]) => ({
        id,
        title,
        totalTime: timeSpent
          .filter((ts) => ts.challengeId === id)
          .reduce((sum, ts) => sum + ts.time, 0),
      }));

    setCompletedChallenges(newChallenges);
  };

  useEffect(() => {
    if (show) updateCompletedChallenges();
  }, [show, completedQuestions, timeSpent]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Completed Challenges</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Sort by Time:</Form.Label>
          <Form.Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="w-auto d-inline-block"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Form.Select>
        </Form.Group>

        {sortedChallenges.length > 0 ? (
          <ul className="list-group">
            {sortedChallenges.map((challenge) => (
              <li
                key={challenge.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold">{challenge.title}</span>
                <span className="text-muted">
                  Total Time: {formatTime(challenge.totalTime)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No challenges fully completed yet.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompletedChallengesModal;
