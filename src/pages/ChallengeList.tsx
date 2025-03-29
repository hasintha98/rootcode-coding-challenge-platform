import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Challenge } from "../types/interfaces";
import { DIFFICULTY_LEVELS, PROGRAMMING_LANGUAGES } from "../common/const";
import { ChallengeService } from "../services/ChallengeService";

const ChallengeList = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [languageFilter, setLanguageFilter] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const navigate = useNavigate();
  const { completedQuestions } = useSelector(
    (state: RootState) => state.challenges
  );

  const fetchChallenges = async () => {
    try {
      const data = await ChallengeService.fetchChallenges(
        page,
        limit,
        languageFilter,
        difficultyFilter
      );
      setChallenges(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setChallenges([]);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [page, languageFilter, difficultyFilter]);

  const handleChallengeClick = (id: number) => {
    navigate(`/challenges/${id}`);
  };

  const isChallengeCompleted = (id: number) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return false;
    const completedCount = completedQuestions.filter(
      (cq) => cq.challengeId === id
    ).length;
    return completedCount === challenge.questions.length;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Coding Challenges
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              value={languageFilter || ""}
              onChange={(e) =>
                setLanguageFilter(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">All Languages</option>
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              value={difficultyFilter || ""}
              onChange={(e) => setDifficultyFilter(e.target.value || null)}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <div key={challenge.id} className="col">
                <div className="card h-100 shadow-sm position-relative">
                  <div className="card-body">
                    <h2 className="card-title fs-5">{challenge.challenge}</h2>
                    <p className="text-muted">Difficulty: {challenge.level}</p>
                    {isChallengeCompleted(challenge.id) && (
                      <span className="badge bg-success position-absolute top-0 end-0 mt-2 me-2">
                        Completed
                      </span>
                    )}
                    <button
                      onClick={() => handleChallengeClick(challenge.id)}
                      className="btn btn-primary w-100 mt-3"
                    >
                      Attempt Challenge
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted col-span-full">
              No challenges available.
            </p>
          )}
        </div>

        <div className="d-flex justify-content-center gap-4 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="align-self-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeList;
