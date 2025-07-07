import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "./src/components/BottomNavigation";

function App() {
	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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
		</SafeAreaView>
	);
}

export default App;
