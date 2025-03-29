import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import CompletedChallengesModal from "./CompletedChallengesModal";
import { CompletedQuestion } from "../types/interfaces"; // Ensure this path is correct
import { logout } from "../store/slices/authSlice"; // Import logout action

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { completedQuestions } = useSelector((state: RootState) => state.challenges);
  const [count, setCount] = useState(0);

  const countCompletedChallenges = (completedQuestions: CompletedQuestion[]): number => {
    const challengeCompletionMap = new Map<number, number>();

    completedQuestions.forEach(({ challengeId }) => {
      if (!challengeCompletionMap.has(challengeId)) {
        challengeCompletionMap.set(challengeId, 0);
      }
      challengeCompletionMap.set(
        challengeId,
        challengeCompletionMap.get(challengeId)! + 1
      );
    });

    let completedChallengesCount = 0;

    challengeCompletionMap.forEach((completedCount, challengeId) => {
      const totalQuestions = completedQuestions.find(
        (item) => item.challengeId === challengeId
      )?.totalQuestions;

      if (totalQuestions && completedCount === totalQuestions) {
        completedChallengesCount++;
      }
    });

    return completedChallengesCount;
  };

  useEffect(() => {
    setCount(countCompletedChallenges(completedQuestions));
  }, [completedQuestions]);

  const handleIndicatorClick = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/"); 
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a
            className="navbar-brand cursor-pointer"
            onClick={() => navigate("/challenges")}
          >
            Coding Challenge Platform
          </a>
          {isAuthenticated && (
            <div className="ms-auto d-flex align-items-center">
              <span
                className="badge bg-light text-primary cursor-pointer me-3"
                onClick={handleIndicatorClick}
              >
                Completed Challenges: {count}
              </span>
              <button
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <CompletedChallengesModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;