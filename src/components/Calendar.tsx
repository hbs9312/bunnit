import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/AntDesign";
import { CalendarBody } from "./CalendarBody";

const deviceWidth = Dimensions.get("window").width;

export const Calendar = ({
	initialDate,
	onChange,
}: {
	initialDate: Date;
	onChange?: (date: Date) => void;
}) => {
	const translateX = useSharedValue(-deviceWidth);
	const height = useSharedValue<number | null>(null);
	const [mode, setMode] = useState<"month" | "week">("month");
	const [displayMonth, setDisplayMonth] = useState<dayjs.Dayjs>(
		dayjs(initialDate),
	);
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
		dayjs(displayMonth),
	);

	const subtractMonth = () => {
		setDisplayMonth(dayjs(displayMonth).subtract(1, "month"));
		translateX.value = -deviceWidth;
	};

	const addMonth = () => {
		setDisplayMonth(dayjs(displayMonth).add(1, "month"));
		translateX.value = -deviceWidth;
	};
	const horizontalPanGesture = Gesture.Pan()
		.activeOffsetX([-50, 50])
		.onUpdate((event) => {
			translateX.value = event.translationX - deviceWidth;
		})
		.onEnd((event) => {
			if (event.translationX > deviceWidth * 0.3) {
				translateX.value = withTiming(0, { duration: 300 }, (isFinished) => {
					if (isFinished) {
						// runOnJS(subtractMonth)();
					}
				});
			} else if (event.translationX < -deviceWidth * 0.3) {
				translateX.value = withTiming(
					-deviceWidth * 2,
					{ duration: 300 },
					(isFinished) => {
						if (isFinished) {
							// runOnJS(addMonth)();
						}
					},
				);
			} else {
				translateX.value = withTiming(-deviceWidth, { duration: 300 });
			}
		});

	const verticalPanGesture = Gesture.Pan()
		.activeOffsetY([-20, 20])
		.onUpdate((event) => {
			console.log(event.translationY);
		})
		.onEnd((event) => {
			console.log(event.translationY);
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
		height: height.value,
	}));

	const handlePreviousMonth = () => {
		setDisplayMonth(dayjs(displayMonth).subtract(1, "month"));
	};

	const handleNextMonth = () => {
		setDisplayMonth(dayjs(displayMonth).add(1, "month"));
	};

	const handleChangeDate = (date: Date) => {
		if (dayjs(date).isSame(selectedDate, "month")) {
			setSelectedDate(dayjs(date));
		} else {
			setDisplayMonth(dayjs(date).startOf("month"));
			setSelectedDate(dayjs(date));
		}
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
				<Text>{dayjs(displayMonth).format("MMMM YYYY")}</Text>
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
			<View style={{ overflow: "hidden" }}>
				<GestureDetector
					gesture={Gesture.Race(horizontalPanGesture, verticalPanGesture)}
				>
					<Animated.View
						onLayout={(event) => {
							console.log(event.nativeEvent.layout.height);
						}}
						style={[
							animatedStyle,
							{
								flexDirection: "row",
								width: "300%",
							},
						]}
					>
						<CalendarBody
							month={displayMonth.subtract(1, "month")}
							selectedDate={selectedDate}
							onDateSelect={handleChangeDate}
						/>
						<CalendarBody
							month={displayMonth}
							selectedDate={selectedDate}
							onDateSelect={handleChangeDate}
						/>
						<CalendarBody
							month={displayMonth.add(1, "month")}
							selectedDate={selectedDate}
							onDateSelect={handleChangeDate}
						/>
					</Animated.View>
				</GestureDetector>
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
