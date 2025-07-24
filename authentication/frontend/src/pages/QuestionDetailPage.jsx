import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchQuestions, deleteQuestion } from "../store/questionSlice";
import EditorComponent from "../components/EditorComponent";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list: questions,
    status,
    error,
  } = useSelector((state) => state.questions);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuestions());
    }
  }, [dispatch, status]);

  const question = questions.find((q) => q._id === id);
  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!question) return <p>Question not found</p>;

  const handleDelete = () => {
    if (window.confirm("Delete this problem?")) {
      dispatch(deleteQuestion(id));
      navigate("/questions");
    }
  };

  return (
    <div className="max-w-2xl p-6 bg-gray-800 rounded-xl text-white">
      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <div className="mb-2">
        <strong>Description:</strong>
        <p className="whitespace-pre-line text-gray-200">
          {question.description}
        </p>
      </div>
      <div className="mb-2">
        <strong>Sample Input:</strong>
        <p className="whitespace-pre-line text-gray-200">{question.input}</p>
      </div>
      <div className="mb-2">
        <strong>Sample Output:</strong>
        <p className="whitespace-pre-line text-gray-200">{question.output}</p>
      </div>
      <div className="mb-2">
        <strong>Constraints:</strong>
        <p className="whitespace-pre-line text-gray-200">
          {question.constraints}
        </p>
      </div>
      <div className="mb-2">
        <strong>Company:</strong>
        <p className="whitespace-pre-line text-gray-200">
          {question.company || "N/A"}
        </p>
      </div>
      <div>
        <EditorComponent />
      </div>
      {user?.isAdmin && (
        <div className="mt-4 space-x-2">
          <Link
            to={`/questions/update/${id}`}
            className="bg-yellow-500 px-4 py-2 rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
