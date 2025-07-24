import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.DEV ? 'http://localhost:5000/api/questions' : '/api/questions';
axios.defaults.withCredentials = true;

export const fetchQuestions = createAsyncThunk(
    'questions/fetchAll', async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE);
            return response.data.questions;
        } catch (err) {
            return rejectWithValue('Failed to fetch questions');
        }
    }
);

export const createQuestion = createAsyncThunk(
    'questions/create', async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE}/create`, payload);
            return response.data.question;
        } catch (err) {
            return rejectWithValue('Failed to create question');
        }
    }
);

export const updateQuestion = createAsyncThunk(
    'questions/update', async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE}/update/${id}`, data);
            return response.data.question;
        } catch (err) {
            return rejectWithValue('Failed to update question');
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    'questions/delete', async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE}/delete/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue('Failed to delete question');
        }
    }
);

const questionSlice = createSlice({
    name: 'questions',
    initialState: {
        list: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchQuestions.fulfilled, (state, action) => { state.list = action.payload; state.status = 'succeeded'; })
            .addCase(createQuestion.fulfilled, (state, action) => { state.list.push(action.payload); })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                const idx = state.list.findIndex(q => q._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.list = state.list.filter(q => q._id !== action.payload);
            });
    }
});

export default questionSlice.reducer;

