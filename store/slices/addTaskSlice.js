// Dependencies
import { createSlice } from "@reduxjs/toolkit";

const addTaskSlice = createSlice({
	name: "addTask",
	initialState: {
		title: "",
		isTitleTouched: false,
		isTitleValid: false,
		description: "",
		timers: [],
		isSetTimer: false,
		isTimePickerOpen: false
	},
	reducers: {
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
		isSetTimerChange: (state, { payload }) => {
			state.isSetTimer = payload;
		},
		isTimePickerOpenChange: (state, { payload }) => {
			state.isTimePickerOpen = payload;
		},
		resetAddTask: state => {
			state.title = "";
			state.description = "";
			state.timers = [];
			state.isTitleTouched = false;
			state.isTitleValid = false;
			state.isSetTimer = false;
			state.isTimePickerOpen = false;
		}
	}
});

export const {
	titleChange,
	descriptionChange,
	addTimer,
	removeTimer,
	isSetTimerChange,
	isTimePickerOpenChange,
	resetAddTask
} = addTaskSlice.actions;

export default addTaskSlice.reducer;
