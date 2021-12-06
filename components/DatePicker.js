// Dependencies
import React, { useState, useEffect } from "react";

// Components
import { StyleSheet } from "react-native";
import { Button, View, useColorMode } from "native-base";
import { Calendar } from "react-native-calendars";
import MainText from "./MainText";

// Actions
import { getAllTable, countTasksAmountDB } from "../utils/db";

const DatePicker = ({ date, onClose, onChange, ongoingTasks, finishedTasks }) => {
	const { colorMode } = useColorMode();
	const [tables, setTables] = useState([]);

	useEffect(() => {
		const getAllTableFromDB = async () => {
			const result = (await getAllTable()).rows._array;

			result.map(async obj => {
				if (obj.name.includes("TASKS")) {
					const tableName = obj.name.split("_").slice(1).reverse().join("-");
					const amount = (await countTasksAmountDB(obj.name)).rows._array[0]["COUNT(*)"];

					if (amount > 0) {
						setTables(prev => [...prev, tableName]);
					}
				}
			});
		};

		getAllTableFromDB();
	}, [ongoingTasks, finishedTasks]);

	const markedDates = {};
	tables.map(table => {
		markedDates[table] = {
			customStyles: {
				container: {
					backgroundColor: "#67e8f9",
					borderRadius: 10
				}
			}
		};
	});

	const CalendarComponent = (
		<Calendar
			current={date}
			minDate={"2021-01-01"}
			maxDate={"2022-12-12"}
			markingType="custom"
			markedDates={markedDates}
			onDayPress={e => {
				onChange(e.dateString);
			}}
			style={styles.calendar}
			theme={{
				todayButtonFontWeight: "bold",
				todayTextColor: "black"
			}}
			{...(colorMode === "dark"
				? {
						theme: {
							calendarBackground: "#27272a",
							dayTextColor: "#fff",
							monthTextColor: "#fff",
							textDisabledColor: "#71717a"
						}
				  }
				: {})}
		/>
	);

	return (
		<View style={styles.datePickerContainer}>
			<View style={styles.calendarContainer}>{CalendarComponent}</View>
			<Button
				borderRadius={10}
				bgColor="gray.50"
				width="90%"
				onPress={onClose}
				_pressed={{ bg: "gray.200" }}
			>
				<MainText color="gray.500">Cancel</MainText>
			</Button>
		</View>
	);
};

export default DatePicker;

const styles = StyleSheet.create({
	datePickerContainer: {
		zIndex: 5,
		position: "absolute",
		top: 0,
		left: 0,
		height: "100%",
		width: "100%",
		padding: 10,
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
		alignItems: "center"
	},
	calendarContainer: {
		width: "100%"
	},
	calendar: {
		borderRadius: 15,
		width: "100%",
		borderColor: "#22d3ee",
		borderWidth: 1,
		elevation: 1,
		marginBottom: 10,
		position: "relative",
		paddingBottom: 40
	}
});
