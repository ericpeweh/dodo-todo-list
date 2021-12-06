// Dependencies
import React, { useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import * as Notifications from "expo-notifications";

// Components
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";

// Navigations
import MainNavigator from "./navigations/MainNavigator";

// Actions
import { deleteTimer } from "./actions/timersActions";
import { fetchTask } from "./utils/db";
import { editTaskDB } from "./actions/tasksActions";

Notifications.setNotificationHandler({
	handleNotification: async () => {
		return {
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: true
		};
	}
});

const Container = () => {
	const dispatch = useDispatch();
	const isDarkMode = useSelector(state => state.settings.isDarkMode);
	const { timers } = useSelector(state => state.timers, shallowEqual);

	useEffect(() => {
		const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
			async notif => {
				const timerData = notif.notification.request.content.data.data;

				dispatch(deleteTimer(timerData.id));

				const task = (await fetchTask({ taskId: timerData.taskId, tableName: timerData.tableName }))
					.rows._array[0];
				const newTimers = JSON.parse(task.timers).filter(timer => timer.id !== timerData.id);

				dispatch(
					editTaskDB({
						editedTask: { ...task, timers: newTimers },
						tableName: timerData.tableName
					})
				);
			}
		);

		const foregroundSubscription = Notifications.addNotificationReceivedListener(async notif => {
			const timerData = notif.request.content.data.data;
			dispatch(deleteTimer(timerData.id));

			const task = (await fetchTask({ taskId: timerData.taskId, tableName: timerData.tableName }))
				.rows._array[0];
			const newTimers = JSON.parse(task.timers).filter(timer => timer.id !== timerData.id);

			dispatch(
				editTaskDB({
					editedTask: { ...task, timers: newTimers },
					tableName: timerData.tableName
				})
			);
		});

		return () => {
			backgroundSubscription.remove();
			foregroundSubscription.remove();
		};
	}, []);

	useEffect(() => {
		timers.map(async timer => {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: timer.title,
					body: "Tap to remove notification.",
					data: { data: { id: timer.id, taskId: timer.taskId, tableName: timer.tableName } },
					sound: "notification.wav"
				},
				trigger: new Date(
					timer.year,
					timer.month - 1,
					timer.day,
					timer.hour,
					timer.minute
				).getTime()
			});
			console.log("TIMER SET!");
		});

		return async () => {
			await Notifications.cancelAllScheduledNotificationsAsync();
		};
	}, [timers]);

	const colorModeManager = {
		get: async () => {
			try {
				let val = isDarkMode;
				return val === "dark" ? "dark" : "light";
			} catch (e) {
				return "light";
			}
		},
		set: async value => {
			try {
				await AsyncStorage.setItem("isDarkMode", value);
			} catch (e) {
				console.log(e);
			}
		}
	};

	return (
		<NativeBaseProvider colorModeManager={colorModeManager}>
			<NavigationContainer>
				<MainNavigator />
			</NavigationContainer>
		</NativeBaseProvider>
	);
};

export default Container;
