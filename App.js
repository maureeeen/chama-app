import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Loader from "./app/components/loader/Loader";
import { DEFAULT_GLOBAL_STATE, GlobalContext } from "./app/context/contenxt";
import { auth } from "./app/helpers/config/firebase";
import { darkTheme, lightTheme } from "./app/helpers/config/theme";
import AuthNav from "./app/navigation/AuthNav";
import TabNav from "./app/navigation/TabNav";

const App = () => {
  const scheme = useColorScheme();
  const [globalState, setGlobalState] = useState(DEFAULT_GLOBAL_STATE);
  const updateGlobalState = (obj) => {
    setGlobalState({ ...globalState, ...obj });
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLoggedUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  return (
    <GlobalContext.Provider value={{ globalState, updateGlobalState }}>
      <PaperProvider
        theme={globalState.theme === "dark" ? darkTheme : lightTheme}
      >
        <NavigationContainer>
          <StatusBar style={globalState.theme === "light" ? "dark" : "light"} />
          <SafeAreaProvider>
            {loading ? <Loader /> : user ? <TabNav /> : <AuthNav />}
          </SafeAreaProvider>
        </NavigationContainer>
      </PaperProvider>
    </GlobalContext.Provider>
  );
};

export default App;
