import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../store/questionSlice";

const QuestionsListPage = () => {
  const dispatch = useDispatch();
  const {
    list: questions,
    status,
    error,
  } = useSelector((state) => state.questions);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuestions());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading questions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl w-full p-6 bg-gray-800 rounded-xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Questions</h2>
        {user?.isAdmin && (
          <Link
            to="/questions/create"
            className="bg-green-500 px-4 py-2 rounded"
          >
            Create New
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id} className="border-b border-gray-700">
                <td className="px-4 py-2">
                  <span className="text-blue-400 font-semibold">{q.title}</span>
                </td>
                <td className="px-4 py-2 text-teal-300">
                  {q.company || "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/questions/${q._id}`)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionsListPage;