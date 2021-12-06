// Dependencies
import { createAsyncThunk } from "@reduxjs/toolkit";

// Actions
import {
	fetchTimers as fetchTimersDB,
	insertTimer,
	deleteTimer as deleteTimerDB,
	deleteTaskTimers as deleteTaskTimersDB
} from "../utils/db";

// Thunk (async)

export const fetchTimers = createAsyncThunk(
	"timers/fetchTimers",
	async (_, { rejectWithValue }) => {
		try {
			const result = await fetchTimersDB();
			return result.rows._array;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const addTimer = createAsyncThunk(
	"timers/addTimer",
	async (timerData, { rejectWithValue }) => {
		try {
			const result = await insertTimer(timerData);
			return result;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const deleteTimer = createAsyncThunk(
	"timers/deleteTimer",
	async (id, { rejectWithValue }) => {
		try {
			await deleteTimerDB(id);
			return id;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const deleteTaskTimers = createAsyncThunk(
	"timers/deleteTaskTimers",
	async (taskId, { rejectWithValue }) => {
		try {
			await deleteTaskTimersDB(taskId);
			return taskId;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
