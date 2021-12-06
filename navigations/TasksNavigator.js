// Dependencies
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorMode } from "native-base";

// Screens
import TasksScreen from "../screens/Main/TasksScreen";
import EditTaskScreen from "../screens/Tasks/EditTaskScreen";
import AddTaskScreen from "../screens/Tasks/AddTaskScreen";
import TaskDetailScreen from "../screens/Tasks/TaskDetailScreen";

const TasksStack = createNativeStackNavigator();

const TasksNavigator = () => {
	const { colorMode } = useColorMode();

	return (
		<TasksStack.Navigator>
			<TasksStack.Screen
				name="TasksList"
				component={TasksScreen}
				options={{
					headerTitle: "All Tasks",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
			<TasksStack.Screen
				name="AddTask"
				component={AddTaskScreen}
				options={{
					headerTitle: "Add Task",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
			<TasksStack.Screen
				name="EditTask"
				component={EditTaskScreen}
				options={{
					headerTitle: "Edit Task",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
			<TasksStack.Screen
				name="TaskDetail"
				component={TaskDetailScreen}
				options={{
					headerTitle: "Task Details",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
		</TasksStack.Navigator>
	);
};

export default TasksNavigator;
