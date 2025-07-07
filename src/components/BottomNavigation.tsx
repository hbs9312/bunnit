import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Routes } from "../../routes";
import CalendarScreen from "../screens/CalendarScreen";
import HomeScreen from "../screens/HomeScreen";
import LibraryScreen from "../screens/LibraryScreen";
import MyPageScreen from "../screens/MyPageScreen";

const BottomTab = createBottomTabNavigator();

const tabs = [
	{
		name: Routes.Home,
		component: HomeScreen,
		icon: IconAntDesign,
		iconName: "home",
	},
	{
		name: Routes.Calendar,
		component: CalendarScreen,
		icon: IconAntDesign,
		iconName: "calendar",
	},
	{
		name: Routes.Library,
		component: LibraryScreen,
		icon: IconFontAwesome5,
		iconName: "dumbbell",
	},
	{
		name: Routes.MyPage,
		component: MyPageScreen,
		icon: IconAntDesign,
		iconName: "user",
	},
];

export const BottomNavigation = () => {
	return (
		<BottomTab.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			{tabs.map((tab) => (
				<BottomTab.Screen
					key={tab.name}
					name={tab.name}
					component={tab.component}
					options={{
						tabBarIcon: ({ color, size }) => (
							<tab.icon name={tab.iconName} color={color} size={size} />
						),
					}}
				/>
			))}
		</BottomTab.Navigator>
	);
};
