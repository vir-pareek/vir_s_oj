import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchQuestionById,
  deleteQuestion,
  clearSelectedQuestion,
} from "../store/questionSlice";
import EditorComponent from "../components/EditorComponent";
import VerdictComponent from "../components/VerdictComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import ResizablePanels from "../components/ResizablePanels";
import client from "../api/client";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast"; // For showing a message
// For boilerplate

const DEFAULT_PLACEHOLDER = "// Your code here";

const BOILERPLATES = {
  cpp: `#include <iostream>
#include <vector>
#include <string>

// Solution class for organization
class Solution {
public:
    void solve() {
        // Your code here
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    Solution solution;
    solution.solve();
    return 0;
}`,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void solve() {
    // Your code here
}

int main() {
    solve();
    return 0;
}`,
  py: `# For competitive programming, it's common to use sys for faster I/O
import sys

def solve():
    # Read input using sys.stdin.readline() for speed
    # Example: line = sys.stdin.readline().strip()
    pass

if __name__ == "__main__":
    solve()
`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        // Use BufferedReader for faster I/O
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
        // Your code here
    }
}`,
};

// An array of all possible boilerplate values for easy checking
const ALL_BOILERPLATES = Object.values(BOILERPLATES);



const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Get the authentication status
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    selectedQuestion: question,
    detailStatus: status,
    error,
  } = useSelector((state) => state.questions);
  const user = useSelector((state) => state.auth.user);

  // --- LOCALSTORAGE LOGIC ---
  const localStorageKey = `codejoy-code-${id}`;
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem(localStorageKey);
    return savedCode || "// Your code here";
  });

  // Other state variables
  const [review, setReview] = useState("");
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [runOutput, setRunOutput] = useState("");
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("custom");
  const [hint, setHint] = useState("");
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);

  // Effect to set boilerplate code when language changes
  useEffect(() => {
    // Helper function to normalize strings by trimming and standardizing line endings
    const normalize = (str) => str.replace(/\r\n/g, "\n").trim();

    const normalizedCode = normalize(code);

    // Check if the current code matches any of the normalized boilerplates
    const isCurrentCodeBoilerplate = ALL_BOILERPLATES.some(
      (b) => normalize(b) === normalizedCode
    );
    const isCurrentCodePlaceholder =
      normalizedCode === normalize(DEFAULT_PLACEHOLDER);

    // This condition now correctly allows switching between any boilerplates
    if (isCurrentCodeBoilerplate || isCurrentCodePlaceholder) {
      setCode(BOILERPLATES[language] || DEFAULT_PLACEHOLDER);
    }
  }, [language]);

  // Effect to save code to localStorage whenever it changes
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(localStorageKey, code);
    }, 500); // Debounce to avoid excessive writes
    return () => {
      clearTimeout(handler);
    };
  }, [code, localStorageKey]);

  // Effect to fetch the question data
  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(id));
    }
    return () => {
      dispatch(clearSelectedQuestion());
    };
  }, [dispatch, id]);

  const handleGetReview = async () => {
    if (!verdict) return;
    setIsReviewLoading(true);
    setReview("");
    try {
      const { data } = await client.post("/ai/review", {
        questionId: id,
        userCode: code,
        language: language,
      });
      setReview(data.review);
    } catch (error) {
      console.error("Failed to get code review:", error);
      setReview(
        "Sorry, we couldn't generate a review for your code right now."
      );
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to submit your solution.");
      navigate("/login");
      return; // Stop the function here
    }
    setIsSubmitting(true);
    setVerdict(null);
    setReview("");
    setActiveTab("verdict");
    try {
      const { data } = await client.post("/submissions/submit", {
        language,
        code,
        questionId: id,
      });
      const { submissionId } = data;
      const intervalId = setInterval(async () => {
        try {
          const { data: responseData } = await client.get(
            `/submissions/${submissionId}`
          );
          if (
            responseData.submission &&
            responseData.submission.status !== "Pending"
          ) {
            setVerdict(responseData.submission);
            setIsSubmitting(false);
            clearInterval(intervalId);
          }
        } catch (pollError) {
          console.error("Polling error:", pollError);
          setVerdict({
            status: "Error",
            output: "Could not retrieve verdict.",
          });
          setIsSubmitting(false);
          clearInterval(intervalId);
        }
      }, 2000);
    } catch (submitError) {
      console.error("Submission error:", submitError);
      setVerdict({
        status: "Error",
        output: "Failed to submit code. Check browser console.",
      });
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    const resultAction = await dispatch(deleteQuestion(id));
    if (deleteQuestion.fulfilled.match(resultAction)) {
      toast.success("Question deleted successfully!");
      navigate("/questions");
    } else {
      toast.error("Failed to delete question.");
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleRunCode = async () => {
    // Add this check at the top of the function
    if (!isAuthenticated) {
      toast.error("Please log in to run your code.");
      navigate("/login");
      return; // Stop the function here
    }
    setIsRunLoading(true);
    setRunOutput("");
    setActiveTab("custom");
    try {
      const { data } = await client.post("/submissions/run", {
        language,
        code,
        input: customInput,
      });
      setRunOutput(data.output);
    } catch (err) {
      setRunOutput(
        err.response?.data?.output ||
          "An error occurred while running the code."
      );
    } finally {
      setIsRunLoading(false);
    }
  };

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

  if (status === "loading" || status === "idle")
    return <p className="text-center text-white">Loading Question...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500">Error: {error}</p>;
  if (!question)
    return <p className="text-center text-white">Question not found</p>;

  const leftPanelContent = (
    <div className="bg-gray-800 p-6 rounded-xl text-white flex flex-col h-full overflow-y-auto">
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
  );

  const rightPanelContent = (
    <div className="flex flex-col h-full min-h-0">
      <EditorComponent language={language} value={code} onChange={setCode} />
      <div className="flex items-center justify-between mt-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={handleRunCode}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={isRunLoading || isSubmitting || !isAuthenticated}
          >
            {isRunLoading ? "Running..." : "Run"}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            disabled={isSubmitting || isRunLoading || !isAuthenticated}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      <div className="flex-grow mt-4 bg-gray-800 rounded-xl p-4 flex flex-col overflow-y-auto min-h-0">
        <div className="flex border-b border-gray-600 mb-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab("custom")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "custom"
                ? "text-white border-b-2 border-cyan-400"
                : "text-gray-400"
            }`}
          >
            Test with Custom Input
          </button>
          <button
            onClick={() => setActiveTab("verdict")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "verdict"
                ? "text-white border-b-2 border-cyan-400"
                : "text-gray-400"
            }`}
          >
            Submission Result
          </button>
        </div>
        {activeTab === "custom" && (
          <div className="flex flex-col gap-4 flex-grow">
            <div>
              <label className="font-semibold text-gray-300 mb-1 block">
                Custom Input:
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white font-mono h-24 resize-y"
                placeholder="Enter your custom input here..."
              ></textarea>
            </div>
            <div>
              <label className="font-semibold text-gray-300 mb-1 block">
                Output:
              </label>
              <div className="w-full p-2 rounded bg-gray-900 text-white font-mono h-24 overflow-y-auto">
                {isRunLoading ? (
                  <p className="text-gray-400">Running...</p>
                ) : (
                  <pre>{runOutput}</pre>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === "verdict" && (
          <div className="flex-grow overflow-y-auto">
            {isSubmitting ? (
              <p className="text-center mt-4 text-gray-400">
                Running Test Cases...
              </p>
            ) : (
              <>
                <VerdictComponent verdict={verdict} />
                {verdict && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <button
                      onClick={handleGetReview}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                      disabled={isReviewLoading}
                    >
                      {isReviewLoading
                        ? "Generating Review..."
                        : "Get AI Code Review"}
                    </button>
                    {(isReviewLoading || review) && (
                      <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                        <h3 className="text-lg font-bold text-purple-300 mb-2">
                          Code Review
                        </h3>
                        {isReviewLoading ? (
                          <p className="text-gray-400">
                            Generating review, please wait...
                          </p>
                        ) : (
                          <div
                            className="whitespace-pre-wrap text-gray-300 prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: review.replace(/\n/g, "<br />"),
                            }}
                          ></div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {user?.isAdmin && (
        <div className="mt-4 space-x-2 border-t border-gray-700 pt-4 flex-shrink-0">
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
  );

  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Question"
        message="Are you sure you want to permanently delete this question? This action cannot be undone."
        confirmText="Delete"
      />
      <div className="flex flex-col h-[calc(100vh-100px)] p-4">
        <ResizablePanels
          leftPanel={leftPanelContent}
          rightPanel={rightPanelContent}
        />
      </div>
    </>
  );
};

export default QuestionDetailPage;