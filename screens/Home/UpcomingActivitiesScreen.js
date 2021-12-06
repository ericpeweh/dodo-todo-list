// Dependencies
import React, { useEffect, useState } from "react";

// Components
import { StyleSheet } from "react-native";
import { Divider, HStack, ScrollView, View, VStack } from "native-base";
import MainText from "../../components/MainText";

// Actions
import { getAllTable, fetchTasks } from "../../utils/db";

// Helpers Variable
const today = new Date().getTime();
const monthLabels = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];

const UpcomingActivitiesScreen = () => {
	const [allActivities, setAllActivities] = useState([]);

	useEffect(() => {
		const fetchAllTasksAndGroup = async () => {
			const tables = (await getAllTable()).rows._array;
			// const allActivities = [];

			tables.map(async table => {
				if (table.name.includes("TASKS")) {
					const dateData = table.name.split("_");
					const tableTime = new Date(dateData[3], dateData[2] - 1, dateData[1]);

					if (tableTime.getTime() > today) {
						const tasks = (await fetchTasks(table.name)).rows._array;

						if (tasks?.length > 0) {
							const taskData = {};
							taskData.day = dateData[1];
							taskData.month = monthLabels[dateData[2] - 1];
							taskData.date = new Date(dateData[3], dateData[2] - 1, dateData[1]).getTime();
							taskData.tasks = tasks.filter(task => task.isFinished === "0");

							setAllActivities(prev => [...prev, taskData]);
						}
					}
				}
			});
		};

		fetchAllTasksAndGroup();
	}, []);

	return (
		<ScrollView _dark={{ bgColor: "dark.200" }}>
			<VStack p={4}>
				{allActivities
					.sort((a, b) => a.date - b.date)
					.map(activity => (
						<HStack
							key={`${activity.day}_${activity.month}_${activity.date}`}
							justifyContent="space-between"
							mb={3}
						>
							{/* DATE */}
							<VStack alignItems="center" pr={6} ml={2}>
								<MainText fontSize="25px" fontWeight="bold" textALign="center">
									{activity.day}
								</MainText>
								<MainText fontSize="15px">{activity.month}</MainText>
								<Divider borderBottomColor="cyan.500" borderBottomWidth={2} />
							</VStack>
							<VStack flex={1}>
								{activity.tasks.map(task => (
									<View
										key={task.id}
										bgColor="white"
										my={1}
										p={3}
										borderRadius="10px"
										elevation={2}
										_dark={{ bg: "gray.500" }}
									>
										<MainText textAlign="right" _dark={{ color: "white" }}>
											{task.title}
										</MainText>
									</View>
								))}
								<Divider my={2} />
							</VStack>
						</HStack>
					))}
			</VStack>
		</ScrollView>
	);
};

export default UpcomingActivitiesScreen;

const styles = StyleSheet.create({});
