import React, { useEffect, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "./components/LoadingSpinner";
import { checkAuth } from "./store/authSlice";
import Layout from "./components/Layout";

// Lazy-load all the page components
const HomePage = React.lazy(() => import("./pages/HomePage")); // Import HomePage
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const QuestionsListPage = React.lazy(() => import("./pages/QuestionsListPage"));
const QuestionDetailPage = React.lazy(() =>
  import("./pages/QuestionDetailPage")
);
const CreateQuestionPage = React.lazy(() =>
  import("./pages/CreateQuestionPage")
);
const UpdateQuestionPage = React.lazy(() =>
  import("./pages/UpdateQuestionPage")
);
const SubmissionsPage = React.lazy(() => import("./pages/SubmissionsPage"));
const SubmissionDetailPage = React.lazy(() =>
  import("./pages/SubmissionDetailPage")
);

// This component protects routes that require a user to be logged in.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // If not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// This component redirects logged-in users away from auth pages (like login/signup).
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // If authenticated, redirect to the dashboard at "/"
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

  if (authStatus === "loading" || authStatus === "idle") {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* --- KEY CHANGE IS HERE --- */}
        {/* The root route "/" now conditionally renders the Dashboard or the Homepage */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <DashboardPage />
              </Layout>
            ) : (
              <HomePage />
            )
          }
        />

        {/* Auth pages - no layout */}
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

        <Route
          path="/questions"
          element={
            <Layout>
              <QuestionsListPage />
            </Layout>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <Layout>
              <QuestionDetailPage />
            </Layout>
          }
        />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <Layout>
                <SubmissionsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SubmissionDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />
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
    </Suspense>
  );
}

export default App;
