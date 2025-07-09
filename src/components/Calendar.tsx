import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const deviceWidth = Dimensions.get("window").width;

const rednerItem = ({
	item,
	isCurrentMonth,
	isSelected,
	onPress,
}: {
	item: dayjs.Dayjs | null;
	isCurrentMonth: boolean;
	isSelected: boolean;
	onPress: () => void;
}) => {
	const textColor = isCurrentMonth ? "black" : "lightgray";
	return (
		<TouchableOpacity
			style={{
				width: deviceWidth / 7,
				height: deviceWidth / 7,
				justifyContent: "center",
				alignItems: "center",
			}}
			onPress={onPress}
		>
			<View
				style={{
					width: 30,
					height: 30,
					justifyContent: "center",
					alignItems: "center",
					borderRadius: 15,
					borderWidth: 1,
					borderColor: isSelected ? "blue" : "transparent",
				}}
			>
				<Text
					style={{
						color: isCurrentMonth ? textColor : "lightgray",
					}}
				>
					{item?.format("D")}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export const Calendar = ({
	initialDate,
	onChange,
}: {
	initialDate: Date;
	onChange?: (date: Date) => void;
}) => {
	const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(
		dayjs(initialDate),
	);
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
		dayjs(selectedMonth),
	);

	const columns = useMemo(() => {
		const startOfMonth = selectedMonth.startOf("month");
		const endOfMonth = selectedMonth.endOf("month");

		const columns: (dayjs.Dayjs | null)[] = [];

		for (let i = 1; i <= startOfMonth.get("day"); i++) {
			columns.unshift(dayjs(startOfMonth).subtract(i, "day"));
		}

		for (let i = 0; i < endOfMonth.get("date"); i++) {
			columns.push(dayjs(startOfMonth).add(i, "day"));
		}

		const diff = 6 - endOfMonth.get("day");
		for (let i = 1; i <= diff; i++) {
			columns.push(dayjs(endOfMonth).add(i, "day"));
		}

		return columns;
	}, [selectedMonth]);

	const handlePreviousMonth = () => {
		setSelectedMonth(dayjs(selectedMonth).subtract(1, "month"));
	};

	const handleNextMonth = () => {
		setSelectedMonth(dayjs(selectedMonth).add(1, "month"));
	};

	useEffect(() => {
		onChange?.(selectedDate.toDate());
	}, [selectedDate, onChange]);

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handlePreviousMonth}>
					<Icon name="left" size={24} color="black" />
				</TouchableOpacity>
				<Text>{dayjs(selectedMonth).format("MMMM YYYY")}</Text>
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
			<View>
				<FlatList
					data={columns}
					numColumns={7}
					renderItem={({ item }) =>
						rednerItem({
							item,
							isCurrentMonth: !!item?.isSame(selectedMonth, "month"),
							isSelected:
								item?.format("YYYY-MM-DD") ===
									selectedDate.format("YYYY-MM-DD") &&
								!!item?.isSame(selectedMonth, "month"),
							onPress: () => {
								if (item) {
									setSelectedMonth(dayjs(item).startOf("month"));
									setSelectedDate(item);
								}
							},
						})
					}
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
});
