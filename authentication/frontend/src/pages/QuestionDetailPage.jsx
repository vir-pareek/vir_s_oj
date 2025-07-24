// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { fetchQuestions, deleteQuestion } from "../store/questionSlice";
// import EditorComponent from "../components/EditorComponent";
// import VerdictComponent from "../components/VerdictComponent";
// // We no longer need to import HintModal
// import client from "../api/client"; // Make sure this path is correct for your axios instance

// const QuestionDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // State for the hint logic
//   const [hint, setHint] = useState("");
//   const [isHintLoading, setIsHintLoading] = useState(false);
//   // We no longer need showHintModal state

//   // State for the submission logic
//   const [code, setCode] = useState(
//     "// Write your C++ code here\n#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}"
//   );
//   const [language, setLanguage] = useState("cpp");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verdict, setVerdict] = useState(null);

//   const {
//     list: questions,
//     status,
//     error,
//   } = useSelector((state) => state.questions);
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchQuestions());
//     }
//   }, [dispatch, status]);

//   const question = questions.find((q) => q._id === id);

//   const handleGetHint = async () => {
//     setHint(""); // Clear previous hint
//     setIsHintLoading(true);
//     try {
//       const { data } = await client.post("/ai/hint", { questionId: id });
//       setHint(data.hint);
//     } catch (error) {
//       console.error("Failed to get hint:", error);
//       setHint(
//         "Sorry, we couldn't generate a hint right now. Please try again later."
//       );
//     } finally {
//       setIsHintLoading(false);
//     }
//   };

//   const handleDelete = () => {
//     if (window.confirm("Delete this problem?")) {
//       dispatch(deleteQuestion(id));
//       navigate("/questions");
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setVerdict(null);

//     try {
//       const { data } = await client.post("/submissions/submit", {
//         language,
//         code,
//         questionId: id,
//       });
//       const { submissionId } = data;

//       const intervalId = setInterval(async () => {
//         try {
//           const { data: verdictData } = await client.get(
//             `/submissions/${submissionId}`
//           );
//           if (verdictData.status !== "Pending") {
//             setVerdict(verdictData);
//             setIsSubmitting(false);
//             clearInterval(intervalId);
//           }
//         } catch (pollError) {
//           console.error("Polling error:", pollError);
//           setVerdict({
//             status: "Error",
//             output: "Could not retrieve verdict.",
//           });
//           setIsSubmitting(false);
//           clearInterval(intervalId);
//         }
//       }, 2000);
//     } catch (submitError) {
//       console.error("Submission error:", submitError);
//       setVerdict({
//         status: "Error",
//         output: "Failed to submit code. Check browser console for details.",
//       });
//       setIsSubmitting(false);
//     }
//   };

//   if (status === "loading")
//     return <p className="text-center text-white">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;
//   if (!question)
//     return <p className="text-center text-white">Question not found</p>;

//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
//       {/* Left Panel: Problem Details */}
//       <div className="md:w-1/2 bg-gray-800 p-6 rounded-xl text-white flex flex-col">
//         <div className="flex-grow">
//           <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
//           <div className="space-y-4">
//             <div>
//               <strong>Description:</strong>
//               <p className="whitespace-pre-line text-gray-300">
//                 {question.description}
//               </p>
//             </div>
//             <div>
//               <strong>Sample Input:</strong>
//               <pre className="bg-gray-900 p-2 rounded text-gray-300">
//                 {question.sampleInput}
//               </pre>
//             </div>
//             <div>
//               <strong>Sample Output:</strong>
//               <pre className="bg-gray-900 p-2 rounded text-gray-300">
//                 {question.sampleOutput}
//               </pre>
//             </div>
//             <div>
//               <strong>Constraints:</strong>
//               <p className="whitespace-pre-line text-gray-300">
//                 {question.constraints}
//               </p>
//             </div>
//             <div>
//               <strong>Company:</strong>
//               <p className="whitespace-pre-line text-gray-300">
//                 {question.company || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* Hint Section */}
//         <div className="mt-6 border-t border-gray-700 pt-4">
//           <button
//             onClick={handleGetHint}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
//             disabled={isHintLoading}
//           >
//             {isHintLoading ? "Generating..." : "Get a Hint"}
//           </button>
//           {/* Conditionally render the hint area below the button */}
//           {(isHintLoading || hint) && (
//             <div className="mt-4 p-4 bg-gray-900 rounded-lg">
//               <h3 className="text-lg font-bold text-cyan-300 mb-2">Hint</h3>
//               {isHintLoading ? (
//                 <p className="text-gray-400">Generating hint, please wait...</p>
//               ) : (
//                 <p className="whitespace-pre-wrap text-gray-300">{hint}</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Panel: Editor and Submission */}
//       <div className="md:w-1/2">
//         <EditorComponent language={language} value={code} onChange={setCode} />
//         <div className="flex items-center justify-between mt-4">
//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="bg-gray-700 text-white p-2 rounded"
//           >
//             <option value="cpp">C++</option>
//             <option value="py">Python</option>
//             <option value="java">Java</option>
//           </select>
//           <button
//             onClick={handleSubmit}
//             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 transition-colors"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//         {isSubmitting && (
//           <p className="text-center mt-4 text-gray-400">
//             Running Test Cases...
//           </p>
//         )}
//         <VerdictComponent verdict={verdict} />
//         {user?.isAdmin && (
//           <div className="mt-4 space-x-2 border-t border-gray-700 pt-4">
//             <Link
//               to={`/questions/update/${id}`}
//               className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition-colors"
//             >
//               Edit
//             </Link>
//             <button
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuestionDetailPage;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchQuestionById,
  deleteQuestion,
  clearSelectedQuestion,
} from "../store/questionSlice";
import EditorComponent from "../components/EditorComponent";
import VerdictComponent from "../components/VerdictComponent";
import client from "../api/client";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for hint and submission logic
  const [hint, setHint] = useState("");
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [code, setCode] = useState(
    "// Write your C++ code here\n#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}"
  );
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);

  const {
    selectedQuestion: question,
    detailStatus: status,
    error,
  } = useSelector((state) => state.questions);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(id));
    }
    return () => {
      dispatch(clearSelectedQuestion());
    };
  }, [dispatch, id]);

  const handleGetHint = async () => {
    setHint("");
    setIsHintLoading(true);
    try {
      const { data } = await client.post("/ai/hint", { questionId: id });
      setHint(data.hint);
    } catch (error) {
      console.error("Failed to get hint:", error);
      setHint(
        "Sorry, we couldn't generate a hint right now. Please try again later."
      );
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this problem?")) {
      dispatch(deleteQuestion(id)).then(() => {
        navigate("/questions");
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setVerdict(null);
    try {
      const { data } = await client.post("/submissions/submit", {
        language,
        code,
        questionId: id,
      });
      const { submissionId } = data;
      const intervalId = setInterval(async () => {
        try {
          const { data: verdictData } = await client.get(
            `/submissions/${submissionId}`
          );
          if (verdictData.status !== "Pending") {
            setVerdict(verdictData);
            setIsSubmitting(false);
            clearInterval(intervalId);
          }
        } catch (pollError) {
          setVerdict({
            status: "Error",
            output: "Could not retrieve verdict.",
          });
          setIsSubmitting(false);
          clearInterval(intervalId);
        }
      }, 2000);
    } catch (submitError) {
      setVerdict({
        status: "Error",
        output: "Failed to submit code. Check browser console.",
      });
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || status === "idle")
    return <p className="text-center text-white">Loading Question...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500">Error: {error}</p>;
  if (!question)
    return <p className="text-center text-white">Question not found</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* Left Panel: Problem Details */}
      <div className="md:w-1/2 bg-gray-800 p-6 rounded-xl text-white flex flex-col">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          <div className="space-y-4">
            <div>
              <strong>Description:</strong>
              <p className="whitespace-pre-line text-gray-300">
                {question.description}
              </p>
            </div>
            <div>
              <strong>Sample Input:</strong>
              <pre className="bg-gray-900 p-2 rounded text-gray-300">
                {question.sampleInput}
              </pre>
            </div>
            <div>
              <strong>Sample Output:</strong>
              <pre className="bg-gray-900 p-2 rounded text-gray-300">
                {question.sampleOutput}
              </pre>
            </div>
            <div>
              <strong>Constraints:</strong>
              <p className="whitespace-pre-line text-gray-300">
                {question.constraints}
              </p>
            </div>
            <div>
              <strong>Company:</strong>
              <p className="whitespace-pre-line text-gray-300">
                {question.company || "N/A"}
              </p>
            </div>
          </div>
        </div>
        {/* Hint Section */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <button
            onClick={handleGetHint}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={isHintLoading}
          >
            {isHintLoading ? "Generating..." : "Get a Hint"}
          </button>
          {(isHintLoading || hint) && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-300 mb-2">Hint</h3>
              {isHintLoading ? (
                <p className="text-gray-400">Generating hint...</p>
              ) : (
                <p className="whitespace-pre-wrap text-gray-300">{hint}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Editor and Submission */}
      <div className="md:w-1/2">
        {/* --- THE FIX IS HERE --- */}
        <EditorComponent
          language={language}
          value={code}
          onValueChange={setCode} // Changed prop back to onValueChange
        />
        <div className="flex items-center justify-between mt-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded"
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        {isSubmitting && (
          <p className="text-center mt-4 text-gray-400">
            Running Test Cases...
          </p>
        )}
        <VerdictComponent verdict={verdict} />
        {user?.isAdmin && (
          <div className="mt-4 space-x-2 border-t border-gray-700 pt-4">
            <Link
              to={`/questions/update/${id}`}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;