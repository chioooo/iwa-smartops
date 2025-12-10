import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DashboardScreen } from "./components/DashboardScreen";

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "dashboard">(
        () => {
            return (localStorage.getItem("currentScreen") as anyy) || "login";
        }
    );

    // Cada vez que cambie la pantalla, guardamos en localStorage
    const updateScreen = (screen: "login" | "register" | "dashboard") => {
        setCurrentScreen(screen);
        localStorage.setItem("currentScreen", screen);
    };

    return (
        <>
            {currentScreen === "login" ? (
                <LoginScreen
                    onGoToRegister={() => updateScreen("register")}
                    onLogin={() => updateScreen("dashboard")}
                />
            ) : currentScreen === "register" ? (
                <RegisterScreen onBackToLogin={() => updateScreen("login")} />
            ) : (
                <DashboardScreen onLogout={() => updateScreen("login")} />
            )}
        </>
    );
}
