// Dependencies
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorMode } from "native-base";

// Screens
import ActiveTimersScreen from "../screens/Home/ActiveTimersScreen";
import UpcomingActivitiesScreen from "../screens/Home/UpcomingActivitiesScreen";
import HomeScreen from "../screens/Main/HomeScreen";
import SettingsScreen from "../screens/Home/SettingsScreen";

// Components
import { Image } from "native-base";
import { StyleSheet } from "react-native";

const HomeStack = createNativeStackNavigator();

const HomeNavigator = () => {
	const { colorMode } = useColorMode();

	return (
		<HomeStack.Navigator>
			<HomeStack.Screen
				name="HomeScreen"
				component={HomeScreen}
				options={{
					headerTitle: () => (
						<Image source={require("../assets/logo.png")} style={styles.logo} alt="Dodo Logo" />
					),
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					}
				}}
			/>
			<HomeStack.Screen
				name="ActiveTimers"
				component={ActiveTimersScreen}
				options={{
					headerTitle: "Active Timers",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
			<HomeStack.Screen
				name="UpcomingActivities"
				component={UpcomingActivitiesScreen}
				options={{
					headerTitle: "Upcoming Activies",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
			<HomeStack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					headerTitle: "Settings",
					headerStyle: {
						backgroundColor: colorMode === "dark" ? "#18181b" : "#fff"
					},
					headerTitleStyle: {
						color: colorMode === "dark" ? "#fff" : "black"
					},
					headerTintColor: colorMode === "dark" ? "#fff" : "black"
				}}
			/>
		</HomeStack.Navigator>
	);
};

const styles = StyleSheet.create({});

export default HomeNavigator;
