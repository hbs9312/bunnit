import dayjs from "dayjs";
import { useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export const Calendar = () => {
	const [currentDate, setCurrentDate] = useState<Date>(dayjs().toDate());

	const handlePreviousMonth = () => {
		setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
	};

	const handleNextMonth = () => {
		setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
	};

	const daysInMonth = dayjs(currentDate).daysInMonth();

	return (
		<View>
			<View style={styles.header}>
				<TouchableOpacity onPress={handlePreviousMonth}>
					<Icon name="left" size={24} color="black" />
				</TouchableOpacity>
				<Text>{dayjs(currentDate).format("MMMM YYYY")}</Text>
				<TouchableOpacity onPress={handleNextMonth}>
					<Icon name="right" size={24} color="black" />
				</TouchableOpacity>
			</View>
			<View style={styles.weekDayHeader}>
				<Text style={{ color: "red" }}>Sun</Text>
				<Text style={{ color: "gray" }}>Mon</Text>
				<Text style={{ color: "gray" }}>Tue</Text>
				<Text style={{ color: "gray" }}>Wed</Text>
				<Text style={{ color: "gray" }}>Thu</Text>
				<Text style={{ color: "gray" }}>Fri</Text>
				<Text style={{ color: "blue" }}>Sat</Text>
			</View>
			<View style={styles.body}>
				<FlatList
					data={Array.from({ length: daysInMonth })}
					renderItem={({ index }) => <Text>{index + 1}</Text>}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
	},
	weekDayHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
	},
	body: {
		flex: 1,
	},
});
