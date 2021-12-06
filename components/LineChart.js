// Dependencies
import React from "react";
import { Dimensions } from "react-native";

// Components
import { StyleSheet } from "react-native";
import { LineChart as RNLineChart } from "react-native-chart-kit";

const LineChart = ({ data }) => {
	return (
		<RNLineChart
			data={{
				labels: [
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
				],
				datasets: [
					{
						data
					}
				]
			}}
			width={Dimensions.get("window").width - 32} // from react-native
			height={220}
			yAxisInterval={1} // optional, defaults to 1
			chartConfig={{
				backgroundColor: "#1a91ff",
				backgroundGradientFrom: "#22d3ee",
				backgroundGradientTo: "#0891b2",
				decimalPlaces: 0,
				color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
				labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
				style: {
					borderRadius: 16
				},
				propsForDots: {
					r: "5",
					strokeWidth: "2",
					stroke: "#0369a1"
				}
			}}
			bezier
			style={{
				marginVertical: 8,
				borderRadius: 10,
				width: "100%",
				paddingRight: 35
			}}
		/>
	);
};

export default LineChart;

const styles = StyleSheet.create({});
