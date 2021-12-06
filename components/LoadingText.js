// Dependencies
import React from "react";

// Components
import { StyleSheet } from "react-native";
import { HStack, Spinner } from "native-base";
import MainText from "./MainText";

const LoadingText = () => {
	return (
		<HStack space={2} alignItems="center">
			<Spinner accessibilityLabel="Loading posts" />
			<MainText color="primary.500" fontSize="md">
				Loading
			</MainText>
		</HStack>
	);
};

export default LoadingText;

const styles = StyleSheet.create({});
