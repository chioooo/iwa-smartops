import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DashboardScreen } from "./components/DashboardScreen";

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "dashboard">("login");

    return (
        <>
            {currentScreen === "login" ? (
                <LoginScreen
                    onGoToRegister={() => setCurrentScreen("register")}
                    onLogin={() => setCurrentScreen("dashboard")}
                />
            ) : currentScreen === "register" ? (
                <RegisterScreen onBackToLogin={() => setCurrentScreen("login")} />
            ) : (
                <DashboardScreen onLogout={() => setCurrentScreen("login")} />

            )}
        </>
    );
}
