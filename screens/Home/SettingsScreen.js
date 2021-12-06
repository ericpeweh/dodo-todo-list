// Dependencies
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componentst
import { HStack, Switch, Divider, VStack } from "native-base";
import { StyleSheet } from "react-native";
import MainText from "../../components/MainText";

// Actions
import { setIsDarkMode } from "../../store/slices/settingsSlice";

const SettingsScreen = () => {
	const dispatch = useDispatch();
	const isDarkMode = useSelector(state => state.settings.isDarkMode);

	const changeDarkModeHandler = value => {
		AsyncStorage.setItem("isDarkMode", value ? "dark" : "light");
		dispatch(setIsDarkMode(value ? "dark" : "light"));
	};

	return (
		<VStack p={4} justifyContent="space-between" flex={1} _dark={{ bg: "dark.300" }}>
			<VStack>
				<HStack justifyContent="space-between" alignItems="center">
					<MainText fontSize="16px">Dark Mode</MainText>
					<Switch size="lg" isChecked={isDarkMode === "dark"} onToggle={changeDarkModeHandler} />
				</HStack>
				<Divider my={2} />
			</VStack>
			<VStack>
				<MainText color="gray.300" textAlign="center" fontSize="12px">
					{"\u00A9"} 2021 | Created by{" "}
					<MainText underline bold>
						ericpeweh
					</MainText>
				</MainText>
				<MainText color="gray.300" textAlign="center" fontSize="12px" mb={5}>
					v 1.0.0
				</MainText>
			</VStack>
		</VStack>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({});
