// Dependencies
import { createSlice } from "@reduxjs/toolkit";

// Actions
import { fetchTimers, deleteTimer, deleteTaskTimers, addTimer } from "../../actions/timersActions";

const timersSlice = createSlice({
	name: "timers",
	initialState: {
		timers: [],
		isFetchingTimers: false,
		initialized: false
	},
	reducers: {},
	extraReducers: {
		[fetchTimers.pending]: state => {
			state.isFetchingTimers = true;
		},
		[fetchTimers.fulfilled]: (state, { payload }) => {
			state.timers = payload;
			state.isFetchingTimers = false;
			state.initialized = true;
		},
		[fetchTimers.rejected]: state => {
			state.isFetchingTimers = false;
		},
		[deleteTimer.fulfilled]: (state, { payload }) => {
			state.timers = state.timers.filter(timer => timer.id !== payload);
		},
		[deleteTaskTimers.fulfilled]: (state, { payload: taskId }) => {
			state.timers = state.timers.filter(timer => timer.taskId !== taskId);
		},
		[addTimer.fulfilled]: (state, { payload }) => {
			state.timers.push(payload);
		}
	}
});

export const {} = timersSlice.actions;

export default timersSlice.reducer;
