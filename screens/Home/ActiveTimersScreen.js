// Dependencies
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import moment from "moment-timezone";

// Components
import { StyleSheet } from "react-native";
import { ScrollView, HStack, VStack, Icon, Pressable, useColorMode } from "native-base";
import MainText from "../../components/MainText";

// Actions
import { fetchTimers } from "../../actions/timersActions";

// Icons
import { MaterialIcons } from "@expo/vector-icons";

const ActiveTimersScreen = ({ navigation }) => {
	const { colorMode } = useColorMode();
	const { timers, isFetchingTimers, initialized } = useSelector(
		state => state.timers,
		shallowEqual
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!initialized) {
			dispatch(fetchTimers());
		}
	}, [initialized, timers]);

	const sortedTimers = [...timers].sort(
		(a, b) =>
			new Date(a.year, a.month - 1, a.day, a.hour, a.minute) -
			new Date(b.year, b.month - 1, b.day, b.hour, b.minute)
	);

	return (
		<ScrollView bgColor={colorMode === "dark" ? "dark.200" : "white"}>
			<VStack p={4}>
				{sortedTimers.length > 0 && (
					<MainText fontWeight="bold" mb={2}>
						Active timers list
					</MainText>
				)}
				{!isFetchingTimers && sortedTimers.length === 0 && (
					<MainText color="gray.400" my={2} textAlign="center">
						No Timer Active
					</MainText>
				)}
				{!isFetchingTimers &&
					sortedTimers.map((timer, index) => (
						<Pressable
							key={timer.id}
							_pressed={{ backgroundColor: "gray.100" }}
							_light={{ backgroundColor: "white" }}
							borderRadius={10}
							onPress={() => {
								navigation.navigate("Tasks", {
									screen: "TaskDetail",
									params: { tableName: timer.tableName, taskId: timer.taskId }
								});
							}}
							elevation={3}
							my={1}
							_dark={{ bg: "gray.500" }}
						>
							<MainText px={4} pt={3} fontSize="16px">
								{timer.title}
							</MainText>
							<HStack p={4} justifyContent="space-between" alignItems="center">
								<HStack justifyContent="space-between" alignItems="center">
									<Icon
										as={MaterialIcons}
										name="timer"
										size={5}
										color="lightBlue.500"
										_dark={{ color: "cyan.400" }}
									/>
									<MainText fontWeight="bold" color="lightBlue.500" _dark={{ color: "cyan.400" }}>
										#{index + 1}
									</MainText>
								</HStack>
								<HStack>
									<MainText ml={6}>
										{moment
											.tz(
												new Date(timer.year, timer.month - 1, timer.day, timer.hour, timer.minute),
												"Asia/Jakarta"
											)
											.format("ddd, D MMMM YYYY  |  HH:mm")}
									</MainText>
								</HStack>
							</HStack>
						</Pressable>
					))}
			</VStack>
		</ScrollView>
	);
};

export default ActiveTimersScreen;

const styles = StyleSheet.create({});
