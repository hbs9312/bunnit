import dayjs from "dayjs";
import { useMemo } from "react";
import {
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const deviceWidth = Dimensions.get("window").width;

interface CalendarBodyProps {
	date: Date;
	selectedDate: dayjs.Dayjs;
	unit: "month" | "week";
	onDateSelect: (date: Date) => void;
}

interface DayItemProps {
	item: dayjs.Dayjs | null;
	isCurrentMonth: boolean;
	isSelected: boolean;
	onPress: () => void;
}

const DayItem = ({
	item,
	isCurrentMonth,
	isSelected,
	onPress,
}: DayItemProps) => {
	const textColor = isCurrentMonth ? "black" : "lightgray";

	return (
		<TouchableOpacity
			style={styles.dayContainer}
			onPress={onPress}
			disabled={!item}
		>
			<View
				style={[
					styles.dayButton,
					{
						borderColor: isSelected ? "#007AFF" : "transparent",
					},
				]}
			>
				<Text
					style={[
						styles.dayText,
						{
							color: textColor,
						},
					]}
				>
					{item?.format("D")}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export const CalendarBody = ({
	date,
	selectedDate,
	unit,
	onDateSelect,
}: CalendarBodyProps) => {
	const calendarDays = useMemo(() => {
		const startOfMonth = dayjs(date).startOf(unit);
		const endOfMonth = dayjs(date).endOf(unit);
		const startDayOfWeek = startOfMonth.day();

		const days: (dayjs.Dayjs | null)[] = [];

		// 이전 달의 날짜들 추가
		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			days.push(startOfMonth.subtract(i + 1, "day"));
		}

		const end = unit === "month" ? endOfMonth.date() : 7;
		// 현재 달의 날짜들 추가
		for (let i = 0; i < end; i++) {
			days.push(startOfMonth.add(i, "day"));
		}

		if (unit === "month") {
			const remaining = 42 - days.length;

			// 다음 달의 날짜들 추가 (6주 표시를 위해)
			for (let i = 1; i <= remaining; i++) {
				days.push(endOfMonth.add(i, "day"));
			}
		}
		return days;
	}, [date, unit]);

	const handleDayPress = (date: Date) => {
		onDateSelect(date);
	};

	const renderDayItem = ({ item }: { item: dayjs.Dayjs | null }) => {
		if (!item) return <View style={styles.dayContainer} />;

		const isCurrent = item.isSame(date, "month");
		const isSelected = item.isSame(selectedDate, "day") && isCurrent;

		return (
			<DayItem
				item={item}
				isCurrentMonth={isCurrent}
				isSelected={isSelected}
				onPress={() => handleDayPress(item.toDate())}
			/>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={calendarDays}
				numColumns={7}
				scrollEnabled={false}
				renderItem={renderDayItem}
				keyExtractor={(item, index) =>
					item ? item.format("YYYY-MM-DD") : `empty-${index}`
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	dayContainer: {
		width: deviceWidth / 7,
		height: deviceWidth / 7,
		justifyContent: "center",
		alignItems: "center",
	},
	dayButton: {
		width: 32,
		height: 32,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 16,
		borderWidth: 1,
	},
	dayText: {
		fontSize: 16,
		textAlign: "center",
	},
});
