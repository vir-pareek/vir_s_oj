import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestions, updateQuestion } from "../store/questionSlice";

const fields = [
  "qid",
  "title",
  "description",
  "input",
  "output",
  "constraints",
  "company",
];

const fieldLabels = {
  qid: "Question ID",
  title: "Title",
  description: "Description",
  input: "Input Format",
  output: "Output Format",
  constraints: "Constraints",
  company: "Company (optional)",
};

const UpdateQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list: questions,
    status,
    error,
  } = useSelector((state) => state.questions);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuestions());
    } else if (!form) {
      const q = questions.find((q) => q._id === id);
      if (q) setForm({ ...q });
    }
  }, [dispatch, status, questions, id, form]);

  if (status === "loading" || !form) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateQuestion({ id, data: form }));
    navigate(`/questions/${id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xxl p-6 bg-gray-800 rounded-xl text-white space-y-4"
    >
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">
        Update Question
      </h2>
      {fields.map((field) => (
        <div key={field}>
          <label className="block mb-1 font-semibold text-cyan-200">
            {fieldLabels[field]}
          </label>
          <textarea
            name={field}
            value={form[field] || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            rows={field === "description" ? 4 : 2}
            placeholder={`Enter ${fieldLabels[field]}...`}
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-yellow-500 px-4 py-2 rounded font-bold w-50 hover:bg-yellow-400 transition"
      >
        {status === "loading" ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default UpdateQuestionPage;
