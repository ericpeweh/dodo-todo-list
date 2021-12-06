// Dependencies
import React from "react";
import { StyleSheet } from "react-native";

// Components
import { Text } from "native-base";

const MainText = props => {
	return (
		<Text style={{ ...styles.text, ...props.style }} {...props}>
			{props.children}
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		fontFamily: "outfit-medium"
	}
});

export default MainText;
