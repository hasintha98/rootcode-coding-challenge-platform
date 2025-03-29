import { JSX, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { RootState } from "./store/store";
import { ProtectedRouteProps } from "./types/interfaces";

const Login = lazy(() => import("./pages/Login"));
const ChallengeList = lazy(() => import("./pages/ChallengeList"));
const ChallengeQuestions = lazy(() => import("./pages/ChallengeQuestions"));

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<ChallengeList />}
              />
            }
          />
          <Route
            path="/challenges/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<ChallengeQuestions />}
              />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

const ProtectedRoute = ({ element, isAuthenticated }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return element;
};

export default App;
