// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createQuestion } from "../store/questionSlice";

// const CreateQuestionPage = () => {
//   const [form, setForm] = useState({
//     qid: "",
//     title: "",
//     description: "",
//     input: "",
//     output: "",
//     constraints: "",
//     company : "",
//   });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { status, error } = useSelector((state) => state.questions);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(createQuestion(form));
//     navigate("/questions");
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-xl p-6 bg-gray-800 rounded-xl text-white space-y-4"
//     >
//       {["qid", "title", "description", "input", "output", "constraints"].map(
//         (field) => (
//           <div key={field}>
//             <label className="block mb-1">{field}</label>
//             <input
//               name={field}
//               value={form[field]}
//               onChange={handleChange}
//               className="w-full p-2 rounded bg-gray-700"
//             />
//           </div>
//         )
//       )}
//       {error && <p className="text-red-500">Error: {error}</p>}
//       <button
//         type="submit"
//         disabled={status === "loading"}
//         className="bg-green-500 px-4 py-2 rounded"
//       >
//         {status === "loading" ? "Submitting..." : "Create"}
//       </button>
//     </form>
//   );
// };

// export default CreateQuestionPage;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../store/questionSlice";

const fields = [
  "qid",
  "title",
  "description",
  "input",
  "output",
  "constraints",
  "company",
];

const CreateQuestionPage = () => {
  const [form, setForm] = useState({
    qid: "",
    title: "",
    description: "",
    input: "",
    output: "",
    constraints: "",
    company: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.questions);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createQuestion(form));
    navigate("/questions");
  };

  return (
    <div className="max-w-xxl mx-auto p-6 bg-gray-800 rounded-xl text-white">
      <h1 className="text-3xl font-bold text-cyan-300 mb-4">Create New Question</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
    <form
      onSubmit={handleSubmit}
      className="max-w-xxl p-6 bg-gray-800 rounded-xl text-white space-y-4"
    >
      {fields.map((field) => (
        <div key={field}>
          <label className="block mb-1 capitalize">{field}</label>
          <textarea
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 resize-y"
            rows={field === "description" ? 4 : 2}
            placeholder={`Enter ${field}...`}
          />
        </div>
      ))}
      {error && <p className="text-red-500">Error: {error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gradient-to-r from-cyan-300 to-teal-500 px-4 py-2 rounded font-bold w-50"
      >
        {status === "loading" ? "Submitting..." : "Create"}
      </button>
    </form>
    </div>
  );
};

export default CreateQuestionPage;