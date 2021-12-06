// Dependencies
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
	titleChange,
	descriptionChange,
	addTimer,
	isTimePickerOpenChange,
	resetEditTask,
	initInput,
	removeTimer
} from "../../store/slices/editTaskSlice";
import uuid from "react-native-uuid";
import { useRoute } from "@react-navigation/native";
import { editTaskDB } from "../../actions/tasksActions";
import { addTimer as addTimerDB, deleteTaskTimers } from "../../actions/timersActions";

// Components
import { StyleSheet } from "react-native";
import {
	View,
	Input,
	FormControl,
	TextArea,
	HStack,
	Divider,
	VStack,
	Icon,
	ScrollView,
	IconButton,
	useColorMode
} from "native-base";
import MainText from "../../components/MainText";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";

// Icons
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";

const MainInput = () => {
	const { colorMode } = useColorMode();
	const { title, description, isTitleTouched, isTitleValid } = useSelector(
		state => state.editTask,
		shallowEqual
	);
	const dispatch = useDispatch();

	return (
		<React.Fragment>
			<FormControl mb={3}>
				<FormControl.Label>
					<MainText fontWeight="bold" fontSize={16}>
						Title
					</MainText>
				</FormControl.Label>
				<Input
					placeholder="Task title"
					variant="filled"
					bgColor="white"
					autoFocus
					borderRadius={10}
					value={title}
					onChangeText={text => dispatch(titleChange(text))}
					_dark={{ bg: "gray.800" }}
					borderColor={
						isTitleTouched && !isTitleValid ? "red.500" : colorMode === "dark" ? "black" : "#fff"
					}
				/>
				{isTitleTouched && !isTitleValid && (
					<MainText color="red.500" mt={1} fontSize="12px">
						Title should not be empty.
					</MainText>
				)}
			</FormControl>
			<FormControl>
				<FormControl.Label>
					<MainText fontWeight="bold" fontSize={16}>
						Description
					</MainText>
				</FormControl.Label>
				<TextArea
					variant="filled"
					bgColor="white"
					placeholder="Task description"
					borderRadius={10}
					value={description}
					_dark={{ bg: "gray.800" }}
					onChangeText={text => dispatch(descriptionChange(text))}
				/>
			</FormControl>
		</React.Fragment>
	);
};

const TimerInput = () => {
	const [selectedDate, setSelectedDate] = useState(null);
	const { timers, isTimePickerOpen } = useSelector(state => state.editTask, shallowEqual);
	const [sortedTimers, setSortedTimers] = useState(timers);
	const dispatch = useDispatch();
	const { colorMode } = useColorMode();

	useEffect(() => {
		setSortedTimers(
			[...timers].sort(
				(a, b) =>
					new Date(a.year, a.month - 1, a.day, a.hour, a.minute) -
					new Date(b.year, b.month - 1, b.day, b.hour, b.minute)
			)
		);
	}, [timers]);

	const isTimePickerChangeHandler = value => {
		dispatch(isTimePickerOpenChange(value));
	};

	return (
		<VStack>
			<HStack alignItems="center" justifyContent="space-between" mb={3}>
				<MainText fontWeight="bold" fontSize={16}>
					Add Timers
				</MainText>
			</HStack>
			<Calendar
				minDate={new Date()}
				onDayPress={e => {
					setSelectedDate({ day: e.day, month: e.month, year: e.year });
					isTimePickerChangeHandler(true);
				}}
				style={{ borderRadius: 10 }}
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
				disableAllTouchEventsForDisabledDays
				disableAllTouchEventsForInactiveDays
			/>
			{isTimePickerOpen && (
				<DateTimePicker
					mode="time"
					value={new Date()}
					onTouchCancel={() => isTimePickerChangeHandler(false)}
					onChange={e => {
						if (selectedDate && e.type === "set") {
							const pickedDate = e.nativeEvent.timestamp;
							dispatch(
								addTimer({
									id: uuid.v4(),
									...selectedDate,
									hour: pickedDate.getHours(),
									minute: pickedDate.getMinutes()
								})
							);
						}
					}}
				/>
			)}
			<VStack my={4}>
				<MainText fontWeight="bold" my={3} fontSize={16}>
					Timer Lists
				</MainText>
				{sortedTimers.map((timer, index) => (
					<HStack
						key={timer.id}
						my={1}
						bgColor="white"
						borderRadius={10}
						p={4}
						justifyContent="space-between"
						alignItems="center"
						_dark={{ bg: "gray.800" }}
					>
						<HStack>
							<Icon as={MaterialIcons} name="timer" size={5} color="lightBlue.500" />
							<MainText fontWeight="bold" color="lightBlue.500">
								{" "}
								#{index + 1}
							</MainText>
							<MainText ml={6}>
								{moment
									// .utc()
									.tz(
										new Date(timer.year, timer.month - 1, timer.day, timer.hour, timer.minute),
										"Asia/Jakarta"
									)
									.format("ddd, D MMMM YYYY  |  HH:mm")}
							</MainText>
						</HStack>
						<IconButton
							size={5}
							icon={<Icon as={MaterialIcons} name="close" size={5} color="gray.300" />}
							onPress={() => dispatch(removeTimer(timer.id))}
						/>
					</HStack>
				))}
				{sortedTimers.length === 0 && (
					<MainText color="gray.400" textAlign="center">
						No Timers Set
					</MainText>
				)}
			</VStack>
		</VStack>
	);
};

const EditTaskScreen = ({ navigation }) => {
	const { title, description, timers, isTitleTouched, isTitleValid } = useSelector(
		state => state.editTask,
		shallowEqual
	);
	const { tableName } = useSelector(state => state.tasks, shallowEqual);
	const dispatch = useDispatch();
	const [task, setTask] = useState(useRoute().params.task);

	// Init input value
	useEffect(() => {
		dispatch(initInput({ title: task.title, description: task.description, timers: task.timers }));
	}, [task]);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IconButton
					icon={<Icon as={Ionicons} name="checkmark-sharp" size="25px" color="primary.600" />}
					borderRadius={10}
					onPress={
						isTitleTouched && isTitleValid
							? editTaskHandler
							: () => {
									dispatch(titleChange(""));
							  }
					}
				/>
			)
		});
	}, [title, description, timers]);

	const editTaskHandler = () => {
		const editedTask = {
			...task,
			title,
			description,
			timers
		};

		dispatch(deleteTaskTimers(task.id));

		timers.map(timer => {
			const newTimer = {
				id: timer.id,
				taskId: task.id,
				year: timer.year,
				month: timer.month,
				day: timer.day,
				hour: timer.hour,
				minute: timer.minute,
				tableName,
				title: title
			};

			dispatch(addTimerDB(newTimer));
		});

		dispatch(editTaskDB({ editedTask, tableName }));
		dispatch(resetEditTask());
		navigation.goBack();
	};

	return (
		<ScrollView _dark={{ bg: "dark.300" }}>
			<View p={4}>
				<MainInput />
				<Divider my={3} />
				{(task.isFinished === "0" || !task.isFinished) && <TimerInput />}
			</View>
		</ScrollView>
	);
};

export default EditTaskScreen;

const styles = StyleSheet.create({});
