import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import ChatPage from "./pages/chat";
import AccountPage from "./pages/account";
import ErrorPage from "./pages/error";
import "./assets/scss/styles.scss";
import router from "./services/Router/Router";
import { getUserInfo } from "./api/auth";
import { setCurrentUser } from "./services/Store";

router
    .use("*", ErrorPage, {
        justification: "Не туда попали",
        errorCode: "404",
    })
    .use("/", LoginPage)
    .use("/sign-up", RegistrationPage)
    .use("/messenger", ChatPage)
    .use("/settings", AccountPage)
    .use("/error500", ErrorPage, {
        justification: "Мы уже фиксим",
        errorCode: "500",
    })
    .start();

document.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === "a") {
        e.preventDefault();
        const link = (e.target as HTMLElement).getAttribute("href");
        if (link) {
            router.go(link);
        }
    }
});

getUserInfo()
    .then((user) => {
        if (
            user &&
            (router._currentRoute?._pathname === "/" ||
                router._currentRoute?._pathname === "/sign-up")
        ) {
            router.go("/messenger");
        }

        setCurrentUser(user);
    })
    .catch(() => {
        if (router._currentRoute?._pathname !== "/sign-up") {
            router.go("/");
        }
    });
