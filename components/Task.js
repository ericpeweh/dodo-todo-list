// Dependencies
import React, { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

// Components
import { HStack, Checkbox, Text, Menu, Icon, View, IconButton, Divider } from "native-base";
import MainText from "./MainText";
import AlertModal from "./AlertModal";

// Icons
import { MaterialIcons, AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

// Actions
import {
	deleteTask,
	markAsOngoing,
	markAsFinished,
	cancelAllTimers
} from "../actions/tasksActions";
import { deleteTimer } from "../actions/timersActions";

const TaskActions = ({ onPressDelete, title, isMenuOpen, onMenu, task }) => {
	const { tableName } = useSelector(state => state.tasks, shallowEqual);
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const detailPressHandler = () => {
		navigation.navigate("TaskDetail", { task });
	};

	const editPressHandler = () => {
		navigation.navigate("EditTask", { task });
	};

	const cancelAllTimerHandler = () => {
		console.log("CANCEL ALL TIMERS");
		task.timers.map(timer => {
			dispatch(deleteTimer(timer.id));
		});
		dispatch(cancelAllTimers({ tableName, taskId: task.id }));
	};

	const deletePressHandler = () => {
		onPressDelete();
	};

	return (
		<Menu
			trigger={triggerProps => {
				return (
					<IconButton
						{...triggerProps}
						icon={
							<Icon
								as={Entypo}
								name="dots-three-horizontal"
								size="sm"
								color="trueGray.400"
								_dark={{ color: "white" }}
							/>
						}
					/>
				);
			}}
			onOpen={() => onMenu(true)}
			onClose={() => onMenu(false)}
			isOpen={isMenuOpen}
			p={2}
			placement="left"
			borderRadius={10}
		>
			<Menu.Item
				flexDirection="row"
				alignItems="center"
				borderRadius={5}
				onPress={detailPressHandler}
				title={title}
			>
				<Icon as={MaterialIcons} name="info" size="xs" color="primary.600" mr={2} />
				<MainText>Details</MainText>
			</Menu.Item>
			<Menu.Item
				flexDirection="row"
				alignItems="center"
				borderRadius={5}
				onPress={editPressHandler}
			>
				<Icon as={Entypo} name="edit" size="xs" color="primary.600" mr={2} />
				<MainText>Edit</MainText>
			</Menu.Item>
			{task.timers.length > 0 && (
				<Menu.Item
					flexDirection="row"
					alignItems="center"
					borderRadius={5}
					onPress={cancelAllTimerHandler}
				>
					<Icon as={Ionicons} name="stop" size="xs" color="primary.600" mr={2} />
					<MainText>Cancel All Timer</MainText>
				</Menu.Item>
			)}
			<Divider my={1} />
			<Menu.Item
				flexDirection="row"
				alignItems="center"
				borderRadius={5}
				onPress={deletePressHandler}
			>
				<Icon as={AntDesign} name="delete" size="xs" color="primary.600" mr={2} color="red.500" />
				<MainText color="red.500">Delete</MainText>
			</Menu.Item>
		</Menu>
	);
};

const Task = ({ task }) => {
	const tableName = useSelector(state => state.tasks.tableName);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

	const dispatch = useDispatch();

	// Delete modal
	const closeDeleteModalHandler = () => {
		setIsDeleteModalOpen(false);
	};

	const openDeleteModalHandler = () => {
		setIsDeleteModalOpen(true);
	};

	// Timer modal
	const closeTimerModalHandler = () => {
		setIsTimerModalOpen(false);
	};

	const openTimerModalHandler = () => {
		setIsTimerModalOpen(true);
	};

	const menuHandler = value => {
		setIsMenuOpen(value);
	};

	const deleteHandler = () => {
		closeDeleteModalHandler();
		dispatch(deleteTask({ taskId: task.id, tableName }));

		task.timers.map(timer => {
			dispatch(deleteTimer(timer.id));
		});
	};

	const taskCheckboxChangeHandler = value => {
		if (value) {
			if (task.timers.length > 0) {
				openTimerModalHandler();
				return;
			}
			dispatch(markAsFinished({ tableName, taskId: task.id }));
		} else {
			dispatch(markAsOngoing({ tableName, taskId: task.id }));
		}
	};

	return (
		<View
			key={task.title}
			style={styles.innerTaskContainer}
			backgroundColor={isMenuOpen ? "darkBlue.50" : "trueGray.50"}
			borderColor="warmGray.100"
			shadow={1}
			_dark={{ bg: "gray.500" }}
		>
			<Checkbox
				isChecked={task.isFinished === "1"}
				onChange={taskCheckboxChangeHandler}
				_dark={{ bg: "gray.100" }}
			>
				<Text
					mx="2"
					strikeThrough={task.isCompleted}
					_light={{
						color: task.isCompleted ? "gray.400" : "coolGray.800"
					}}
					fontFamily="outfit-medium"
				>
					{task.title}
				</Text>
			</Checkbox>
			<HStack alignItems="center" justifyContent="center">
				{task.timers.length > 0 && (
					<MainText
						color="cyan.500"
						fontWeight="bold"
						mr={1}
						fontSize="16px"
						_dark={{ color: "cyan.400" }}
					>
						{task.timers.length}
					</MainText>
				)}
				{task.timers.length > 0 && (
					<Icon
						as={MaterialIcons}
						name="timer"
						size="20px"
						color="cyan.500"
						mr={1}
						_dark={{ color: "cyan.400" }}
					/>
				)}
				<TaskActions
					onPressDelete={openDeleteModalHandler}
					title={task.title}
					isMenuOpen={isMenuOpen}
					onMenu={menuHandler}
					task={task}
				/>
				<AlertModal
					isOpen={isDeleteModalOpen}
					onClose={closeDeleteModalHandler}
					onConfirm={deleteHandler}
					title="Delete Task"
					description="Do you want to delete this task?. This action cannot be reversed. Deleted data can not be
					recovered."
					buttonTitle="Delete"
					type="danger"
				/>
				<AlertModal
					isOpen={isTimerModalOpen}
					onClose={closeTimerModalHandler}
					onConfirm={() => {
						task.timers.map(timer => {
							dispatch(deleteTimer(timer.id));
						});

						dispatch(markAsFinished({ tableName, taskId: task.id }));
					}}
					title="Timer is active"
					w
					description="Marking this task as finished will stop all related running timers. Are you sure ?"
					buttonTitle="Stop Timer"
					type="warning"
				/>
			</HStack>
		</View>
	);
};

export default Task;

const styles = StyleSheet.create({
	innerTaskContainer: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		flex: 1,
		borderRadius: 10
	},
	taskActionsContainer: {
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10
	}
});
