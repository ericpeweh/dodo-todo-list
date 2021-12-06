// Dependencies
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Font from "expo-font";
import store from "./store/index";
import { Provider } from "react-redux";

// Components
import AppLoading from "expo-app-loading";
import Container from "./Container";

// DB Actions
import { createTimersTable } from "./utils/db";

export default function App() {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	const loadFonts = async () => {
		await Font.loadAsync({
			"outfit-bold": require("./assets/fonts/Outfit-Bold.ttf"),
			"outfit-medium": require("./assets/fonts/Outfit-Medium.ttf")
		});
		setFontsLoaded(true);
	};

	useEffect(() => {
		const initTimersTable = async () => await createTimersTable();

		initTimersTable();
		loadFonts();
	}, []);

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<Provider store={store}>
			<Container />
		</Provider>
	);
}

const styles = StyleSheet.create({});
