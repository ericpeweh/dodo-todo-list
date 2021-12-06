// Depedencies
import { createSlice } from "@reduxjs/toolkit";
import moment from "moment-timezone";

// Actions
import {
	addTaskDB,
	fetchTasks,
	deleteTask,
	markAsFinished,
	markAsOngoing,
	editTaskDB,
	cancelAllTimers
} from "../../actions/tasksActions";

const tasksSlice = createSlice({
	name: "tasks",
	initialState: {
		selectedDate: moment.tz(moment.utc(), "Asia/Jakarta").toISOString(),
		tableName: "",
		ongoingTasks: [],
		finishedTasks: [],
		isTableExists: false,
		isFetchingTasks: false,
		isUpdatingTask: false
	},
	reducers: {
		selectedDateChange: (state, { payload }) => {
			state.selectedDate = payload;
			state.isTableExists = false;
		},
		tableNameChange: (state, { payload }) => {
			state.tableName = payload;
		}
	},
	extraReducers: {
		[fetchTasks.pending]: state => {
			state.isFetchingTasks = true;
		},
		[fetchTasks.fulfilled]: (state, { payload }) => {
			const tasks = payload.map(task => ({ ...task, timers: JSON.parse(task.timers) }));
			const ongoing = tasks.filter(task => task.isFinished === "0");
			const finished = tasks.filter(task => task.isFinished === "1");
			state.isFetchingTasks = false;
			state.ongoingTasks = ongoing;
			state.finishedTasks = finished;
		},
		[fetchTasks.rejected]: state => {
			state.isFetchingTasks = false;
			state.ongoingTasks = [];
			state.finishedTasks = [];
		},
		[addTaskDB.fulfilled]: (state, { payload }) => {
			state.ongoingTasks.push(payload);
		},
		[addTaskDB.rejected]: (state, { payload }) => {
			console.log(payload);
		},
		[editTaskDB.fulfilled]: (state, { payload }) => {
			state.ongoingTasks = state.ongoingTasks.map(task =>
				task.id === payload.id ? payload : task
			);
			state.finishedTasks = state.finishedTasks.map(task =>
				task.id === payload.id ? payload : task
			);
		},
		[editTaskDB.rejected]: (state, { payload }) => {
			console.log(payload);
		},
		[deleteTask.fulfilled]: (state, { payload }) => {
			state.ongoingTasks = state.ongoingTasks.filter(task => task.id !== payload);
			state.finishedTasks = state.finishedTasks.filter(task => task.id !== payload);
		},
		[markAsFinished.pending]: state => {
			state.isUpdatingTask = true;
		},
		[markAsFinished.fulfilled]: (state, { payload: taskId }) => {
			const selectedTask = state.ongoingTasks.find(task => task.id === taskId);
			// Add to finished
			state.finishedTasks.push({ ...selectedTask, isFinished: "1", timers: [] });
			// Remove from ongoing
			state.ongoingTasks = state.ongoingTasks.filter(task => taskId !== task.id);

			state.isUpdatingTask = false;
		},
		[markAsOngoing.pending]: state => {
			state.isUpdatingTask = true;
		},
		[markAsOngoing.fulfilled]: (state, { payload: taskId }) => {
			const selectedTask = state.finishedTasks.find(task => task.id === taskId);
			// Add to ongoing
			state.ongoingTasks.push({ ...selectedTask, isFinished: "0" });
			// Remove from finished
			state.finishedTasks = state.finishedTasks.filter(task => taskId !== task.id);

			state.isUpdatingTask = false;
		},
		[cancelAllTimers.fulfilled]: (state, { payload: taskId }) => {
			// Change on ongoing
			state.ongoingTasks = state.ongoingTasks.map(task =>
				taskId === task.id ? { ...task, timers: [] } : task
			);
			// Change on finished
			state.finishedTasks = state.finishedTasks.map(task =>
				taskId === task.id ? { ...task, timers: [] } : task
			);
		}
	}
});

export const { selectedDateChange, addTask, tableNameChange } = tasksSlice.actions;

export default tasksSlice.reducer;
