import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import QuestionsListPage from "./pages/QuestionsListPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import UpdateQuestionPage from "./pages/UpdateQuestionPage";

import LoadingSpinner from "./components/LoadingSpinner";
import { checkAuth } from "./store/authSlice";
import Layout from "./components/Layout";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user,
    status: authStatus,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authStatus === "idle") dispatch(checkAuth());
  }, [dispatch, authStatus]);

  if (authStatus === "loading") return <LoadingSpinner />;

  return (
    <Routes>
      {/* Dashboard - protected and with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Auth pages - without layout */}
      <Route
        path="/signup"
        element={
          <RedirectAuthenticatedUser>
            <SignUpPage />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectAuthenticatedUser>
            <LoginPage />
          </RedirectAuthenticatedUser>
        }
      />

      {/* Questions List */}
      <Route
        path="/questions"
        element={
          // <ProtectedRoute>
            <Layout>
              <QuestionsListPage />
            </Layout>
          // </ProtectedRoute>
        }
      />

      {/* Question Detail */}
      <Route
        path="/questions/:id"
        element={
          // <ProtectedRoute>
            <Layout>
              <QuestionDetailPage />
            </Layout>
          // </ProtectedRoute>
        }
      />

      {/* Admin-only: Create Question */}
      <Route
        path="/questions/create"
        element={
          <ProtectedRoute>
            <Layout>
              {user?.isAdmin ? (
                <CreateQuestionPage />
              ) : (
                <Navigate to="/questions" replace />
              )}
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin-only: Update Question */}
      <Route
        path="/questions/update/:id"
        element={
          <ProtectedRoute>
            <Layout>
              {user?.isAdmin ? (
                <UpdateQuestionPage />
              ) : (
                <Navigate to="/questions" replace />
              )}
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
