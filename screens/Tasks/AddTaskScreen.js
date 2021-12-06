// Dependencies
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
	titleChange,
	descriptionChange,
	addTimer,
	isSetTimerChange,
	isTimePickerOpenChange,
	resetAddTask
} from "../../store/slices/addTaskSlice";
import uuid from "react-native-uuid";
import { addTaskDB } from "../../actions/tasksActions";
import { addTimer as addTimerDB } from "../../actions/timersActions";
import { removeTimer } from "../../store/slices/addTaskSlice";

// Components
import { StyleSheet } from "react-native";
import {
	View,
	Input,
	FormControl,
	TextArea,
	Switch,
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
	const { title, description, isTitleValid, isTitleTouched } = useSelector(
		state => state.addTask,
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
					_dark={{ bg: "gray.800" }}
					onChangeText={text => dispatch(titleChange(text))}
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
	const dispatch = useDispatch();
	const [selectedDate, setSelectedDate] = useState(null);
	const { timers, isSetTimer, isTimePickerOpen } = useSelector(
		state => state.addTask,
		shallowEqual
	);
	const [sortedTimers, setSortedTimers] = useState(timers);
	const { colorMode } = useColorMode();

	const setTimerChangeHandler = value => {
		dispatch(isSetTimerChange(value));
	};

	const isTimePickerChangeHandler = value => {
		dispatch(isTimePickerOpenChange(value));
	};

	useEffect(() => {
		setSortedTimers(
			[...timers].sort(
				(a, b) =>
					new Date(a.year, a.month - 1, a.day, a.hour, a.minute) -
					new Date(b.year, b.month - 1, b.day, b.hour, b.minute)
			)
		);
	}, [timers]);

	return (
		<VStack>
			<HStack alignItems="center" justifyContent="space-between">
				<MainText fontWeight="bold" fontSize={16}>
					Set Timer?
				</MainText>
				<Switch
					size="lg"
					onToggle={e => setTimerChangeHandler(e)}
					isChecked={isSetTimer}
					{...(colorMode === "dark" ? { offTrackColor: "gray.500" } : {})}
				/>
			</HStack>
			{isSetTimer && (
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
			)}
			{isSetTimer && isTimePickerOpen && (
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
						// isTimePickerChangeHandler(false);
					}}
				/>
			)}
			{isSetTimer && (
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
								icon={
									<Icon
										as={MaterialIcons}
										name="close"
										size={5}
										color="gray.300"
										onPress={() => dispatch(removeTimer(timer.id))}
									/>
								}
							/>
						</HStack>
					))}
				</VStack>
			)}
		</VStack>
	);
};

const AddTaskScreen = ({ navigation }) => {
	const { title, description, timers, isTitleTouched, isTitleValid } = useSelector(
		state => state.addTask,
		shallowEqual
	);
	const { tableName } = useSelector(state => state.tasks, shallowEqual);
	const dispatch = useDispatch();

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IconButton
					icon={<Icon as={Ionicons} name="checkmark-sharp" size="25px" color="primary.600" />}
					borderRadius={10}
					onPress={
						isTitleTouched && isTitleValid
							? addTaskHandler
							: () => {
									dispatch(titleChange(""));
							  }
					}
				/>
			)
		});
	}, [title, description, timers, isTitleTouched, isTitleValid]);

	useEffect(() => {
		dispatch(isSetTimerChange(false));
		dispatch(isTimePickerOpenChange(false));
	}, []);

	const addTaskHandler = () => {
		const newTask = {
			id: uuid.v4(),
			title,
			description,
			timers,
			isFinished: false
		};

		dispatch(addTaskDB({ newTask, tableName }));
		// Insert timers to database
		newTask.timers.map(timer => {
			const newTimer = {
				id: timer.id,
				taskId: newTask.id,
				year: timer.year,
				month: timer.month,
				day: timer.day,
				hour: timer.hour,
				minute: timer.minute,
				tableName,
				title: newTask.title
			};

			dispatch(addTimerDB(newTimer));
		});
		dispatch(resetAddTask());
		navigation.goBack();
	};

	return (
		<ScrollView _dark={{ bg: "dark.200" }}>
			<View p={4}>
				<MainInput />
				<Divider my={3} />
				<TimerInput />
			</View>
		</ScrollView>
	);
};

export default AddTaskScreen;

const styles = StyleSheet.create({});
