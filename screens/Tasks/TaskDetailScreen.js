// Dependencies
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import moment from "moment-timezone";

// Components
import { StyleSheet } from "react-native";
import MainText from "../../components/MainText";
import { ScrollView, View, VStack, HStack, Badge, Divider, Icon } from "native-base";

// DB Actions
import { fetchTask } from "../../utils/db";

// Icons
import { MaterialIcons } from "@expo/vector-icons";

const TaskDetailScreen = ({ navigation }) => {
	const [task, setTask] = useState(useRoute().params?.task);
	const tableName = useRoute().params?.tableName;
	const taskId = useRoute().params?.taskId;

	if (tableName) {
		const fetchSingleTask = async () => {
			const result = await fetchTask({ taskId, tableName });
			setTask({ ...result.rows._array[0], timers: JSON.parse(result.rows._array[0].timers) });
		};
		fetchSingleTask();
	}

	const sortedTimers =
		task &&
		[...task.timers].sort(
			(a, b) =>
				new Date(a.year, a.month - 1, a.day, a.hour, a.minute) -
				new Date(b.year, b.month - 1, b.day, b.hour, b.minute)
		);

	return (
		<ScrollView _dark={{ bgColor: "dark.300" }}>
			{task && (
				<VStack p={4}>
					<MainText fontWeight="bold" fontSize={16}>
						Title
					</MainText>
					<View
						bgColor="white"
						p={4}
						mt={2}
						borderRadius={10}
						elevation={3}
						_dark={{ bg: "gray.500" }}
					>
						<MainText _dark={{ color: "#fff" }}>{task.title}</MainText>
					</View>
					<MainText fontWeight="bold" fontSize={16} mt={4}>
						Description
					</MainText>
					<View
						bgColor="white"
						p={4}
						mt={2}
						borderRadius={10}
						elevation={3}
						_dark={{ bg: "gray.500" }}
					>
						<MainText
							color={task.description ? "black" : "gray.400"}
							_dark={{ color: !task.description ? "gray.400" : "#fff" }}
						>
							{task.description ? task.description : "No description."}
						</MainText>
					</View>
					<Divider my={3} />
					<HStack justifyContent="space-between" alignItems="center" mt={3}>
						<MainText fontWeight="bold" fontSize={16}>
							Created At
						</MainText>
						<Badge
							borderRadius={10}
							colorScheme="light"
							py={1}
							px={2}
							variant="subtle"
							minWidth="200px"
						>
							<MainText>
								{moment
									.tz(moment.utc(task.createdAt), "Asia/Jakarta")
									.format("ddd, D MMMM YYYY  |  HH:mm")}
							</MainText>
						</Badge>
					</HStack>
					<HStack justifyContent="space-between" alignItems="center" my={3}>
						<MainText fontWeight="bold" fontSize={16}>
							Last Modified
						</MainText>
						<Badge
							borderRadius={10}
							colorScheme="light"
							py={1}
							px={2}
							variant="subtle"
							minWidth="200px"
						>
							<MainText>
								{moment
									.tz(moment.utc(task.lastModified), "Asia/Jakarta")
									.format("ddd, D MMMM YYYY  |  HH:mm")}
							</MainText>
						</Badge>
					</HStack>
					<Divider my={4} />
					<HStack justifyContent="space-between" alignItems="center">
						<MainText fontWeight="bold" fontSize={16}>
							Task status
						</MainText>
						<Badge
							borderRadius={10}
							colorScheme={task.isFinished === "1" ? "success" : "warning"}
							variant="subtle"
							py={1}
							px={2}
							minWidth="100px"
						>
							<MainText>{task.isFinished === "1" ? "FINISHED" : "ONGOING"}</MainText>
						</Badge>
					</HStack>
					<HStack justifyContent="space-between" alignItems="center" mt={3}>
						<MainText fontWeight="bold" fontSize={16}>
							Timer status
						</MainText>
						<Badge
							borderRadius={10}
							colorScheme="success"
							py={1}
							px={2}
							variant="subtle"
							minWidth="100px"
						>
							<MainText>
								{sortedTimers.length > 0 ? `${task.timers?.length} ACTIVE` : "NO TIMER SET"}
							</MainText>
						</Badge>
					</HStack>
					<Divider my={4} />

					{sortedTimers.map((timer, index) => (
						<HStack
							key={timer.id}
							my={1}
							bgColor="white"
							borderRadius={10}
							p={4}
							justifyContent="space-between"
							alignItems="center"
							_dark={{ bg: "gray.700" }}
						>
							<HStack justifyContent="space-between" alignItems="center">
								<Icon as={MaterialIcons} name="timer" size={5} color="lightBlue.500" />
								<MainText fontWeight="bold" color="lightBlue.500">
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
					))}
				</VStack>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({});

export default TaskDetailScreen;
