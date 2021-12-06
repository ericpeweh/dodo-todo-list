// Dependencies
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

// Components
import { Fab, Icon } from "native-base";

// Icons
import { Entypo } from "@expo/vector-icons";

const FLoatingButton = () => {
	const navigation = useNavigation();

	const openAddScreenHandler = () => {
		navigation.navigate("AddTask");
	};

	return (
		<Fab
			placement="bottom-right"
			position="absolute"
			size="lg"
			bottom="15px"
			right="15px"
			icon={<Icon as={Entypo} name="add-to-list" size="sm" />}
			renderInPortal={false}
			shadow="2"
			onPress={openAddScreenHandler}
		/>
	);
};

export default FLoatingButton;

const styles = StyleSheet.create({});
