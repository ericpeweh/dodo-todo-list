// Dependencies
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { selectedDateChange, tableNameChange } from "../../store/slices/tasksSlice";

// Utils
import { fetchTasks } from "../../actions/tasksActions";

// Components
import { StyleSheet } from "react-native";
import {
	IconButton,
	Box,
	VStack,
	HStack,
	Icon,
	ScrollView,
	Text,
	Divider,
	View
} from "native-base";
import Task from "../../components/Task";
import FloatingButton from "../../components/FloatingButton";
import DatePicker from "../../components/DatePicker";
import LoadingText from "../../components/LoadingText";

// Icons
import { Entypo } from "@expo/vector-icons";

const TasksScreen = () => {
	const { ongoingTasks, finishedTasks, selectedDate, tableName, isFetchingTasks, isUpdatingTask } =
		useSelector(state => state.tasks, shallowEqual);
	const dispatch = useDispatch();
	const [isDateOpen, setIsDateOpen] = useState(false);

	const tempOngoingTasks = ongoingTasks;
	const tempFinishedTasks = finishedTasks;

	const datePickHandler = value => {
		setIsDateOpen(value);
	};

	const dateChangeHandler = value => {
		dispatch(selectedDateChange(value));
		setIsDateOpen(false);
	};

	useEffect(() => {
		dispatch(fetchTasks(tableName));
	}, [tableName]);

	useEffect(() => {
		if (selectedDate) {
			const dateObj = new Date(selectedDate);
			const day = dateObj.getDate();
			const month = dateObj.getMonth() + 1;
			const year = dateObj.getFullYear();
			const tableName = `TASKS_${day < 10 ? "0" + day : day}_${
				month < 10 ? "0" + month : month
			}_${year}`;

			dispatch(tableNameChange(tableName));
		}
	}, [selectedDate]);

	return (
		<View flex={1} _dark={{ bg: "dark.200" }}>
			{isDateOpen && (
				<DatePicker
					date={selectedDate}
					onClose={() => datePickHandler(false)}
					onChange={dateChangeHandler}
					onGoingTasks={ongoingTasks}
					finishedTasks={finishedTasks}
				/>
			)}
			<ScrollView style={styles.taskScreenContainer} height="100%">
				<View flex={1} p={5} marginBottom={20}>
					<Box height="100%">
						<Text style={styles.subtitle}>Selected Date</Text>
						<HStack direction="row" mb={5} justifyContent="space-between">
							<Text fontFamily="outfit-bold" fontSize={24}>
								{moment(selectedDate).format("dddd, D MMMM")}
							</Text>
							<IconButton
								size="sm"
								colorScheme="trueGray"
								ml={2}
								icon={
									<Icon
										as={Entypo}
										name="calendar"
										size="sm"
										color="primary.600"
										_dark={{ color: "cyan.400" }}
									/>
								}
								onPress={() => setIsDateOpen(prev => !prev)}
							/>
						</HStack>
						{isFetchingTasks && (
							<HStack justifyContent="center">
								<LoadingText />
							</HStack>
						)}

						{/* ON GOING TASK */}
						<Text
							mb={3}
							fontWeight="bold"
							color="primary.600"
							fontFamily="outfit-medium"
							_dark={{ color: "cyan.400" }}
						>
							Ongoing Tasks
						</Text>
						<Divider mb={2} borderWidth={0.2} borderColor="primary.400" />
						<VStack space={2} mb={5}>
							{!isUpdatingTask && ongoingTasks.map(task => <Task task={task} key={task.id} />)}
							{isUpdatingTask && tempOngoingTasks.map(task => <Task task={task} key={task.id} />)}
						</VStack>

						{/* FINISHED TASK */}
						<Text
							mb={3}
							fontWeight="bold"
							fontFamily="outfit-medium"
							color="primary.600"
							_dark={{ color: "cyan.400" }}
						>
							Finished
						</Text>
						<Divider mb={2} borderWidth={0.2} borderColor="primary.400" />
						<VStack space={2}>
							{!isUpdatingTask && finishedTasks.map(task => <Task task={task} key={task.id} />)}
							{isUpdatingTask && tempFinishedTasks.map(task => <Task task={task} key={task.id} />)}
						</VStack>
					</Box>
				</View>
			</ScrollView>
			<FloatingButton />
		</View>
	);
};

export default TasksScreen;

const styles = StyleSheet.create({
	taskScreenContainer: {
		width: "100%",
		flex: 1,
		paddingBottom: 0
	},
	subtitle: {
		fontFamily: "outfit-bold"
	}
});
