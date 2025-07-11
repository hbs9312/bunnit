import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
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
	const height = useSharedValue((deviceWidth / 7) * 6);

	const translateY = useSharedValue(0);
	const [mode, setMode] = useState<"month" | "week">("month");
	const [isAnimating, setIsAnimating] = useState(false);

	const prevHeight = useSharedValue((deviceWidth / 7) * 6);

	const [displayMonth, setDisplayMonth] = useState<dayjs.Dayjs>(
		dayjs(initialDate).set("date", 1),
	);
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

	const weekNumber = useMemo(() => {
		const startOfWeek = displayMonth.set("date", 1).day();

		return Math.ceil((startOfWeek + displayMonth.date()) / 7);
	}, [displayMonth]);

	const selectedLine = useMemo(() => {
		if (!dayjs(selectedDate).isSame(displayMonth, "month")) {
			return null;
		}
		const startOfWeek = selectedDate.set("date", 1).day();
		return Math.ceil((startOfWeek + selectedDate.date()) / 7);
	}, [selectedDate, displayMonth]);

	const subtractMonth = () => {
		setDisplayMonth(dayjs(displayMonth).subtract(1, mode));
	};

	const addMonth = () => {
		setDisplayMonth(dayjs(displayMonth).add(1, mode));
	};
	const horizontalPanGesture = Gesture.Pan()
		.activeOffsetX([-5, 5])
		.onStart(() => {
			runOnJS(setIsAnimating)(true);
		})
		.onUpdate((event) => {
			translateX.value = event.translationX - deviceWidth;
		})
		.onEnd((event) => {
			if (event.translationX > deviceWidth * 0.3) {
				translateX.value = withTiming(0, { duration: 300 }, (isFinished) => {
					runOnJS(subtractMonth)();
					if (isFinished) {
						runOnJS(setIsAnimating)(false);
					}
				});
			} else if (event.translationX < -deviceWidth * 0.3) {
				translateX.value = withTiming(
					-deviceWidth * 2,
					{ duration: 300 },
					(isFinished) => {
						runOnJS(addMonth)();

						if (isFinished) {
							runOnJS(setIsAnimating)(false);
						}
					},
				);
			} else {
				translateX.value = withTiming(
					-deviceWidth,
					{ duration: 300 },
					(isFinished) => {
						if (isFinished) {
							runOnJS(setIsAnimating)(false);
						}
					},
				);
			}
		});

	const verticalStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	const verticalPanGesture = Gesture.Pan()
		.activeOffsetY([-10, 10])
		.onUpdate((event) => {
			height.value = prevHeight.value + event.translationY;
			console.log(weekNumber);

			translateY.value =
				(mode === "week"
					? -prevHeight.value * ((selectedLine ?? weekNumber) - 1)
					: 0) +
				((deviceWidth / 7) *
					event.translationY *
					((selectedLine ?? weekNumber) - 1)) /
					((deviceWidth / 7) * 5);
		})
		.onEnd((event) => {
			if (event.translationY < 50) {
				prevHeight.value = deviceWidth / 7;
				translateY.value = withTiming(
					(-deviceWidth / 7) * ((selectedLine ?? weekNumber) - 1),
					{
						duration: 300,
					},
				);
				height.value = withTiming(
					deviceWidth / 7,
					{ duration: 300 },
					(isFinished) => {
						if (isFinished) {
							runOnJS(setIsAnimating)(false);
							runOnJS(setMode)("week");
						}
					},
				);
			} else if (event.translationY > -50) {
				prevHeight.value = (deviceWidth / 7) * 6;
				translateY.value = withTiming(0, { duration: 300 });
				height.value = withTiming(
					(deviceWidth / 7) * 6,
					{ duration: 300 },
					(isFinished) => {
						if (isFinished) {
							runOnJS(setMode)("month");
							runOnJS(setIsAnimating)(false);
						}
					},
				);
			} else {
				height.value = withTiming(
					prevHeight.value,
					{ duration: 300 },
					(isFinished) => {
						if (isFinished) {
							runOnJS(setIsAnimating)(false);
						}
					},
				);
			}
		});

	const translateStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
			height: height.value,
		};
	});

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

	const testTranslateStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

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
				{/* <Text>{isAnimating ? "Animating" : "Not animating"}</Text> */}
				<GestureDetector
					gesture={Gesture.Race(horizontalPanGesture, verticalPanGesture)}
				>
					<View style={{ flexDirection: "column-reverse" }}>
						<Animated.View
							style={[
								translateStyle,
								{
									display: isAnimating ? "flex" : "none",
								},
							]}
						>
							<Animated.View
								style={[
									{
										width: "300%",
										flexDirection: "row",
										overflow: "hidden",
										borderBottomWidth: 1,
										borderColor: "#E0E0E0",
									},
									// testTranslateStyle,
								]}
							>
								<CalendarBody
									date={displayMonth.subtract(1, "month").toDate()}
									selectedDate={selectedDate}
									onDateSelect={handleChangeDate}
									unit={mode}
								/>
								<CalendarBody
									date={displayMonth.toDate()}
									selectedDate={selectedDate}
									onDateSelect={handleChangeDate}
									unit={mode}
								/>
								<CalendarBody
									date={displayMonth.add(1, "month").toDate()}
									selectedDate={selectedDate}
									onDateSelect={handleChangeDate}
									unit={mode}
								/>
							</Animated.View>
						</Animated.View>

						<Animated.View
							style={[
								verticalStyle,
								{
									display: isAnimating ? "none" : "flex",
									borderBottomWidth: 1,
									borderColor: "#E0E0E0",
								},
							]}
						>
							<Animated.View
								style={[testTranslateStyle, { height: (deviceWidth / 7) * 6 }]}
							>
								<CalendarBody
									date={displayMonth.toDate()}
									selectedDate={selectedDate}
									onDateSelect={handleChangeDate}
									unit="month"
								/>
							</Animated.View>
						</Animated.View>
					</View>
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
