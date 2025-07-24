// import { motion } from "framer-motion";
// // import { useAuthStore } from "../store/authStore";
// import { formatDate } from "../utils/date";
// import { useSelector } from "react-redux";

// const user = useSelector((state) => state.auth.user);

// const DashboardPage = () => {
//   const { user, logout, question } = useAuthStore();

//   const handleLogout = () => {
//     logout();
//   };

//   const handleQuestions = () => {
//     question();
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
//     >
//       <h2 className="text-3xl font-bold mb-6 text-center bg-[#F0F8FF] text-transparent bg-clip-text">
//         Dashboard
//       </h2>

//       <div className="space-y-6">
//         <motion.div
//           className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h3 className="text-xl font-semibold text-[#68e5e5] mb-3">
//             Profile Information
//           </h3>
//           <p className="text-gray-300">Name: {user.name}</p>
//           <p className="text-gray-300">Email: {user.email}</p>
//         </motion.div>
//         <motion.div
//           className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <h3 className="text-xl font-semibold text-[#68e5e5] mb-3">
//             Account Activity
//           </h3>
//           <p className="text-gray-300">
//             <span className="font-bold">Joined: </span>
//             {new Date(user.createdAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//           <p className="text-gray-300">
//             <span className="font-bold">Last Login: </span>

//             {formatDate(user.lastLogin)}
//           </p>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//         className="mt-4"
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleQuestions}
//           className="w-full py-3 px-4 bg-gradient-to-r from-[#68e5e5] to-[#098989] text-white mb-3 
//                         font-bold rounded-lg shadow-lg hover:from-[#098989]
//                         hover:to-[#098989] focus:outline-none focus:ring-2 focus:ring-[#68e5e5] focus:ring-offset-2
//                          focus:ring-offset-gray-900 transition duration-200"
//         >
//           Solve Questions
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleLogout}
//           className="w-full py-3 px-4 bg-gradient-to-r from-[#68e5e5] to-[#098989] text-white 
//                         font-bold rounded-lg shadow-lg hover:from-[#098989]
//                         hover:to-[#098989] focus:outline-none focus:ring-2 focus:ring-[#68e5e5] focus:ring-offset-2
//                          focus:ring-offset-gray-900 transition duration-200"
//         >
//           Logout
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };
// export default DashboardPage;


import { motion } from "framer-motion";
import { formatDate } from "../utils/date";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleQuestions = () => {
    navigate("/questions");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-[#F0F8FF] text-transparent bg-clip-text">
        Dashboard
      </h2>

      <div className="space-y-6">
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-[#68e5e5] mb-3">
            Profile Information
          </h3>
          <p className="text-gray-300">Name: {user?.name}</p>
          <p className="text-gray-300">Email: {user?.email}</p>
        </motion.div>
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-[#68e5e5] mb-3">
            Account Activity
          </h3>
          <p className="text-gray-300">
            <span className="font-bold">Joined: </span>
            {user?.createdAt &&
              new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Last Login: </span>
            {user?.lastLogin && formatDate(user.lastLogin)}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleQuestions}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#68e5e5] to-[#098989] text-white mb-3 
                        font-bold rounded-lg shadow-lg hover:from-[#098989]
                        hover:to-[#098989] focus:outline-none focus:ring-2 focus:ring-[#68e5e5] focus:ring-offset-2
                         focus:ring-offset-gray-900 transition duration-200"
        >
          Solve Questions
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#68e5e5] to-[#098989] text-white 
                        font-bold rounded-lg shadow-lg hover:from-[#098989]
                        hover:to-[#098989] focus:outline-none focus:ring-2 focus:ring-[#68e5e5] focus:ring-offset-2
                         focus:ring-offset-gray-900 transition duration-200"
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
