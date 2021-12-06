// Dependencies
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";

// Slices
import tasksSlice from "./slices/tasksSlice";
import addTaskSlice from "./slices/addTaskSlice";
import editTaskSlice from "./slices/editTaskSlice";
import timersSlice from "./slices/timersSlice";
import settingsSlice from "./slices/settingsSlice";

export default configureStore(
	{
		reducer: {
			tasks: tasksSlice,
			addTask: addTaskSlice,
			editTask: editTaskSlice,
			timers: timersSlice,
			settings: settingsSlice
		}
	},
	composeWithDevTools()
);
