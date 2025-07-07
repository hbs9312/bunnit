import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Routes } from "../../routes";
import CalendarScreen from "../screens/CalendarScreen";
import HomeScreen from "../screens/HomeScreen";
import LibraryScreen from "../screens/LibraryScreen";
import MyPageScreen from "../screens/MyPageScreen";

const BottomTab = createBottomTabNavigator();

export const BottomNavigation = () => {
	return (
		<BottomTab.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<BottomTab.Screen name={Routes.Home} component={HomeScreen} />
			<BottomTab.Screen name={Routes.Calendar} component={CalendarScreen} />
			<BottomTab.Screen name={Routes.Library} component={LibraryScreen} />
			<BottomTab.Screen name={Routes.MyPage} component={MyPageScreen} />
		</BottomTab.Navigator>
	);
};
