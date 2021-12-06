// Dependencies
import React, { useEffect, useState } from "react";

// Components
import { StyleSheet } from "react-native";
import { View, ScrollView, VStack, HStack, Icon, Pressable, IconButton } from "native-base";
import MainText from "../../components/MainText";
import LineChart from "../../components/LineChart";

// Actions
import {
	getAllTable,
	countTasksAmountDB,
	countTasksOngoingDB,
	countTasksFinishedDB
} from "../../utils/db";

// Icons
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";

// Components
import { Image } from "native-base";

const today = new Date();

const HomeScreen = ({ navigation }) => {
	const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
	const [tasksCreated, setTaskCreated] = useState(0);
	const [finished, setFinished] = useState(0);
	const [ongoing, setOngoing] = useState(0);

	useEffect(() => {
		const generateReportData = async () => {
			const result = (await getAllTable()).rows._array;

			// BUILD CHART DATA
			result.map(async obj => {
				if (obj.name.includes("TASKS")) {
					const tableName = obj.name.split("_");
					if (tableName[3] === today.getFullYear() + "") {
						const tableNameToCount = tableName.join("_");

						const amount = (await countTasksAmountDB(tableNameToCount)).rows._array[0]["COUNT(*)"];

						const monthCode = parseInt(tableName[2]) - 1;

						setMonthlyData(prev => [
							...prev.slice(0, monthCode),
							prev[monthCode] + amount,
							...prev.slice(monthCode + 1)
						]);
					}
				}
			});

			// BUILD SUMMARY
			result.map(async obj => {
				if (obj.name.includes("TASKS")) {
					const ongoingTaskAmount = (await countTasksOngoingDB(obj.name)).rows._array[0][
						"COUNT(*)"
					];

					const finishedTaskAmount = (await countTasksFinishedDB(obj.name)).rows._array[0][
						"COUNT(*)"
					];

					setOngoing(prev => prev + ongoingTaskAmount);
					setFinished(prev => prev + finishedTaskAmount);
					setTaskCreated(prev => prev + ongoingTaskAmount + finishedTaskAmount);
				}
			});
		};

		generateReportData();
	}, []);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IconButton
					borderRadius={10}
					onPress={() => navigation.navigate("Settings")}
					icon={<Icon as={Feather} name="settings" size="25px" color="primary.600" />}
				/>
			),
			headerTitle: () => (
				<View height="100%" flex={1}>
					<Image source={require("../../assets/logo.png")} style={styles.logo} alt="Dodo Logo" />
				</View>
			)
		});
	}, []);

	return (
		<ScrollView _dark={{ backgroundColor: "dark.200" }}>
			<View p={4} flex={1} position="relative">
				<VStack>
					<MainText fontSize={24} fontWeight="bold">
						Data Report
					</MainText>
					<MainText mt={2}>{today.getFullYear()} Monthly Activity</MainText>
					<LineChart data={monthlyData} />
					<MainText mt={2}>Activity Summary</MainText>
					<HStack mt={2} space={2}>
						<VStack
							alignItems="center"
							p={2}
							flex={2}
							_light={{ backgroundColor: "white" }}
							_dark={{ backgroundColor: "dark.200" }}
							borderRadius="10px"
							borderWidth={1}
							borderColor="cyan.300"
						>
							<MainText fontWeight="bold" fontSize={20}>
								{tasksCreated}
							</MainText>
							<MainText>Tasks Created</MainText>
						</VStack>
						<VStack
							alignItems="center"
							p={2}
							flex={1}
							_light={{ backgroundColor: "white" }}
							_dark={{ backgroundColor: "dark.200" }}
							borderRadius="10px"
							borderWidth={1}
							borderColor="cyan.300"
						>
							<MainText fontWeight="bold" fontSize={20}>
								{finished}
							</MainText>
							<MainText>Finished</MainText>
						</VStack>
						<VStack
							alignItems="center"
							p={2}
							flex={1}
							_light={{ backgroundColor: "white" }}
							_dark={{ backgroundColor: "dark.200" }}
							borderRadius="10px"
							borderWidth={1}
							borderColor="cyan.300"
						>
							<MainText fontWeight="bold" fontSize={20}>
								{ongoing}
							</MainText>
							<MainText>Ongoing</MainText>
						</VStack>
					</HStack>
					<MainText fontSize={24} fontWeight="bold" mt={4}>
						Menu
					</MainText>
					<HStack mt={2}>
						<Pressable
							onPress={e => navigation.navigate("ActiveTimers")}
							style={styles.menuItem}
							bgColor="cyan.500"
							_pressed={{ bgColor: "cyan.600" }}
							mr={2}
						>
							<VStack flex={1} justifyContent="center" alignItems="center">
								<Icon as={MaterialIcons} name="timer" size="30px" color="white" />
								<MainText mt={1} color="white">
									Active Timer
								</MainText>
							</VStack>
						</Pressable>
						<Pressable
							onPress={e => navigation.navigate("UpcomingActivities")}
							style={styles.menuItem}
							bgColor="cyan.500"
							_pressed={{ bgColor: "cyan.600" }}
							ml={2}
						>
							<VStack flex={1} justifyContent="center" alignItems="center">
								<Icon as={AntDesign} name="pushpino" size="30px" color="white" />
								<MainText mt={1} color="white">
									Upcoming Activities
								</MainText>
							</VStack>
						</Pressable>
					</HStack>
				</VStack>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	agenda: {
		borderRadius: 10,
		position: "absolute",
		top: 0,
		left: 0
	},
	menuItem: {
		borderRadius: 10,
		height: 100,
		padding: 15,
		flex: 1
		// backgroundColor: "#fff"
	},
	logo: {
		height: 50,
		width: 70,
		resizeMode: "contain"
	}
});

export default HomeScreen;
