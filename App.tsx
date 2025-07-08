import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "./src/components/BottomNavigation";

function App() {
	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
			<GestureHandlerRootView>
				<NavigationContainer
					theme={{
						...DefaultTheme,
						colors: {
							...DefaultTheme.colors,
							background: "white",
						},
					}}
				>
					<BottomNavigation />
				</NavigationContainer>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
}

export default App;
