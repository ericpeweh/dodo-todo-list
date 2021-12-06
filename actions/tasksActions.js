// Dependencies
import { createAsyncThunk } from "@reduxjs/toolkit";

// Actions
import {
	fetchTasks as fetchTasksDB,
	insertTask,
	editTask,
	createTable,
	deleteTask as deleteTaskDB,
	markAsFinished as markAsFinishedDB,
	markAsOngoing as markAsOngoingDB,
	cancelAllTimers as cancelAllTimersDB
} from "../utils/db";

// Thunk (async)
export const fetchTasks = createAsyncThunk(
	"tasks/fetchTasks",
	async (tableName, { rejectWithValue }) => {
		try {
			const result = await fetchTasksDB(tableName);
			return result.rows._array;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const addTaskDB = createAsyncThunk(
	"tasks/addTask",
	async (taskData, { rejectWithValue }) => {
		try {
			await createTable(taskData.tableName);
			const newTask = insertTask(taskData);

			return newTask;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const editTaskDB = createAsyncThunk(
	"tasks/editTask",
	async (taskData, { rejectWithValue }) => {
		try {
			const editedTask = await editTask(taskData);
			return editedTask;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const deleteTask = createAsyncThunk(
	"tasks/deleteTask",
	async (taskData, { rejectWithValue }) => {
		try {
			await deleteTaskDB(taskData);
			return taskData.taskId;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const markAsFinished = createAsyncThunk(
	"tasks/markAsFinished",
	async (taskData, { rejectWithValue }) => {
		try {
			await markAsFinishedDB(taskData);
			return taskData.taskId;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const markAsOngoing = createAsyncThunk(
	"tasks/markAsOngoing",
	async (taskData, { rejectWithValue }) => {
		try {
			await markAsOngoingDB(taskData);
			return taskData.taskId;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const cancelAllTimers = createAsyncThunk(
	"tasks/cancelAllTimers",
	async (taskData, { rejectWithValue }) => {
		try {
			await cancelAllTimersDB(taskData);
			return taskData.taskId;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
