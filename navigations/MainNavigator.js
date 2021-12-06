// Dependencies
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorMode } from "native-base";

// Navigations
import TasksNavigator from "./TasksNavigator";
import HomeNavigator from "./HomeNavigator";

// Actions
import { setIsDarkMode } from "../store/slices/settingsSlice";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Variables
const MainTab = createBottomTabNavigator();

const MainNavigator = () => {
	const { colorMode } = useColorMode();
	const dispatch = useDispatch();

	const mainNavigatorOptions = ({ route, colors }) => ({
		tabBarIcon: ({ focused, color }) => {
			let iconName;

			if (route.name === "Home") {
				iconName = focused ? "home" : "home-outline";
			} else if (route.name === "Tasks") {
				iconName = focused ? "md-list-sharp" : "md-list-outline";
			} else {
				iconName = focused ? "checkbox" : "checkbox-outline";
			}

			return <Ionicons name={iconName} size={24} color={color} />;
		},
		tabBarActiveTintColor: "#27c3db",
		tabBarItemStyle: {
			height: 50
		},
		tabBarStyle: {
			height: 55,
			backgroundColor: colorMode === "dark" ? "#27272a" : "white"
		},
		tabBarLabelStyle: {
			fontFamily: "outfit-bold",
			fontSize: 12
		}
	});

	useEffect(() => {
		const checkIsDarkMode = async () => {
			AsyncStorage.getItem("isDarkMode")
				.then(value => {
					if (value !== null) {
						dispatch(setIsDarkMode(value));
					} else {
						AsyncStorage.setItem("isDarkMode", "light");
						dispatch(setIsDarkMode("light"));
					}
				})
				.catch(err => false);
		};

		checkIsDarkMode();
	}, []);

	return (
		<MainTab.Navigator screenOptions={mainNavigatorOptions}>
			<MainTab.Screen name="Home" component={HomeNavigator} options={{ headerShown: false }} />
			<MainTab.Screen name="Tasks" component={TasksNavigator} options={{ headerShown: false }} />
		</MainTab.Navigator>
	);
};

export default MainNavigator;
