// Dependencies
import { createSlice } from "@reduxjs/toolkit";

const editTaskSlice = createSlice({
	name: "editTask",
	initialState: {
		title: "",
		isTitleTouched: false,
		isTitleValid: false,
		description: "",
		timers: [],
		isTimePickerOpen: false
	},
	reducers: {
		initInput: (state, { payload }) => {
			const { title, description, timers } = payload;
			state.title = title;
			state.description = description;
			state.timers = timers;
			state.isTitleTouched = true;
			state.isTitleValid = true;
		},
		titleChange: (state, { payload }) => {
			state.title = payload;
			state.isTitleTouched = true;
			state.isTitleValid = payload.length !== 0;
		},
		descriptionChange: (state, { payload }) => {
			state.description = payload;
		},
		addTimer: (state, { payload }) => {
			state.timers.push(payload);
			state.isTimePickerOpen = false;
		},
		removeTimer: (state, { payload }) => {
			state.timers = state.timers.filter(timer => timer.id !== payload);
		},
		isTimePickerOpenChange: (state, { payload }) => {
			state.isTimePickerOpen = payload;
		},
		resetEditTask: state => {
			state.title = "";
			state.description = "";
			state.timers = [];
			state.isTitleTouched = false;
			state.isTitleValid = false;
			state.isTimePickerOpen = false;
		}
	}
});

export const {
	titleChange,
	descriptionChange,
	addTimer,
	removeTimer,
	isTimePickerOpenChange,
	resetEditTask,
	initInput
} = editTaskSlice.actions;

export default editTaskSlice.reducer;
