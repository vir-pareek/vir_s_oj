// import { create } from "zustand";
// import axios from "axios";

// const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

// axios.defaults.withCredentials = true;

// export const useAuthStore = create((set) => ({
//     user: null,
//     isAuthenticated: false,
//     error: null,
//     isLoading: false,
//     isCheckingAuth: true,
//     message: null,

//     signup: async (email, password, name) => {
//         set({ isLoading: true, error: null });
//         try {
//             const response = await axios.post(`${API_URL}/signup`, { email, password, name, adminCode });
//             set({ user: response.data.user, isAuthenticated: true, isLoading: false });
//         } catch (error) {
//             set({ error: error.response.data.message || "Error signing up", isLoading: false });
//             throw error;
//         }
//     },
//     login: async (email, password) => {
//         set({ isLoading: true, error: null });
//         try {
//             const response = await axios.post(`${API_URL}/login`, { email, password });
//             set({
//                 isAuthenticated: true,
//                 user: response.data.user,
//                 error: null,
//                 isLoading: false,
//             });
//         } catch (error) {
//             set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
//             throw error;
//         }
//     },

//     logout: async () => {
//         set({ isLoading: true, error: null });
//         try {
//             await axios.post(`${API_URL}/logout`);
//             set({ user: null, isAuthenticated: false, error: null, isLoading: false });
//         } catch (error) {
//             set({ error: "Error logging out", isLoading: false });
//             throw error;
//         }
//     },

//     question_list: async () => {
        
//     },

//     checkAuth: async () => {
//         set({ isCheckingAuth: true, error: null });
//         console.log("Checking authentication status...");
        
//         try {
//             const response = await axios.get(`${API_URL}/check-auth`,  {withCredentials: true});
//             if(response.data.authenticated === false){
//                 // console.log("User is not authenticated, redirecting to login...");
//                 set({ user: null, isAuthenticated: false, isCheckingAuth: false });
//                 return;
//             }
//             console.log(response);
            
//             set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            
//         } catch (error) {
//             set({ error: null, isCheckingAuth: false, isAuthenticated: false });
//         }
//     },
//     // SOLUTION: Add a function to clear the error state
//     clearError: () => {
//         set({ error: null });
//     },
// }));