import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import {demoDataService} from "./services/usersService.tsx";

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "dashboard">(
        () => {
            return (localStorage.getItem("currentScreen") as any) || "login";
        }
    );

    // usuario logueado
    const [loggedUser, setLoggedUser] = useState<any>(() => {
        const saved = localStorage.getItem("loggedUser");
        return saved ? JSON.parse(saved) : null;
    });

    const updateScreen = (screen: "login" | "register" | "dashboard") => {
        setCurrentScreen(screen);
        localStorage.setItem("currentScreen", screen);
    };

    const handleLogin = (input: string) => {
        const user = demoDataService.getUsers().find(
            u =>
                u.email.toLowerCase() === input.toLowerCase() ||
                u.name.toLowerCase() === input.toLowerCase()
        );

        if (!user) {
            alert("Usuario no encontrado");
            return;
        }

        setLoggedUser(user);
        localStorage.setItem("loggedUser", JSON.stringify(user));
        updateScreen("dashboard");
    };

    const handleLogout = () => {
        setLoggedUser(null);
        localStorage.removeItem("loggedUser");
        updateScreen("login");
    };

    return (
        <>
            {currentScreen === "login" ? (
                <LoginScreen
                    onGoToRegister={() => updateScreen("register")}
                    onLogin={handleLogin}
                />
            ) : currentScreen === "register" ? (
                <RegisterScreen onBackToLogin={() => updateScreen("login")} />
            ) : (
                <DashboardScreen
                    onLogout={handleLogout}
                    user={loggedUser}
                />
            )}
        </>
    );
}
