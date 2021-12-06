// Dependencies
import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		isDarkMode: false
	},
	reducers: {
		setIsDarkMode: (state, { payload }) => {
			state.isDarkMode = payload;
		}
	}
});

export const { setIsDarkMode } = settingsSlice.actions;

export default settingsSlice.reducer;
