An online judge platform inspired by LeetCode and HackerRank. 
This project allows users to write, submit, and test their solutions to programming problems in real-time, receiving instant feedback on their code's correctness and performance. 
This project was a journey into full-stack development and system design to understand the complexities behind running untrusted user code securely.

1. Features

- Solve a collection of algorithmic problems.

- Submit solutions in multiple languages (e.g., C++, JavaScript, Python).

- Receive real-time compilation, execution, and judging against test cases.

- Each submission is run in a secure, sandboxed Docker container.

- Get instant feedback on submissions, such as Accepted, Wrong Answer, or Time Limit Exceeded.

2. Tech Stack & Architecture
3. 
Frontend: React.js & Tailwind CSS (Deployed on Vercel)

Backend: Node.js & Express.js (Deployed on Render)

Database: MongoDB

Code Execution Compiler: A custom compiler using Docker for sandboxing (Deployed on AWS)

System Flow:

A user submits code from the React frontend.

The submission is sent to the Node.js backend.

The backend creates a job and sends the code to the execution engine.

The engine spins up a secure Docker container to compile and run the code.

The execution output is captured and sent back to the backend.

The backend saves the result to MongoDB and notifies the frontend.

3. Getting Started (Local Setup)

Prerequisites: Node.js, npm, Docker, and MongoDB must be installed.

Backend Setup:

Clone the repository and navigate to the backend directory.

Run npm install to install dependencies.

Create a .env file and add PORT, MONGO_URI, and JWT_SECRET.

Run npm start to start the server.

Frontend Setup:

Navigate to the frontend directory.

Run npm install to install dependencies.

Create a .env.local file and add VITE_API_URL=http://localhost:5000.

Run npm run dev to start the frontend.

4. Key Challenge & Learning

The primary challenge was securely executing untrusted user code.

A sandboxed environment was implemented using Docker containers for each submission. This involved:

Creating a new, isolated container for every submission.

Setting strict resource limits for CPU and memory to prevent infinite loops.

Disabling all network access from within the container.

Safely managing code files and capturing standard output and error streams.

5. Contributing

Contributions, issues, and feature requests are welcome.
