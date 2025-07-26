import React from "react";

const VerdictComponent = ({ verdict }) => {
  if (!verdict) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-500";
      case "Wrong Answer":
        return "text-red-500";
      case "Compilation Error":
      case "Runtime Error":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Submission Result</h3>
      <p>
        <strong>Status: </strong>
        <span className={`font-bold ${getStatusColor(verdict.status)}`}>
          {verdict.status}
        </span>
      </p>
      {verdict.status !== "Accepted" && (
        <div className="mt-2">
          <strong>Details:</strong>
          <pre className="bg-black p-2 rounded mt-1 whitespace-pre-wrap text-sm text-gray-300">
            {verdict.output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VerdictComponent;
