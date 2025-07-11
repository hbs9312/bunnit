import { View } from "react-native";
import { Calendar } from "../components/Calendar";

export default function CalendarScreen() {
	return (
		<View style={{ flex: 1 }}>
			<Calendar
				initialDate={new Date()}
				// onChange={(date) => console.log(date)}
			/>
		</View>
	);
}
