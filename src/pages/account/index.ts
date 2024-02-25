import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import "./styles.scss";

const scripts = () => {
    // Edit User Info Start
    document.querySelector(".user-info")?.addEventListener("submit", (e) => {
        e.preventDefault();
        document.querySelector("section#account")?.removeAttribute("data-edit");
        const userInfoInputs = document.querySelectorAll(".user-info li input");
        userInfoInputs.forEach((el: HTMLInputElement) => {
            el.disabled = !el.disabled;
        });
    });

    document
        .querySelector('[data-click="editPassword"]')
        ?.addEventListener("click", () => {
            document
                .querySelector("section#account")
                ?.setAttribute("data-edit", "password");
            const userInfoInputs = document.querySelectorAll(
                ".user-info li input"
            );
            userInfoInputs.forEach((el: HTMLInputElement) => {
                el.disabled = !el.disabled;
            });
        });

    document
        .querySelector('[data-click="editUserInfo"]')
        ?.addEventListener("click", () => {
            document
                .querySelector("section#account")
                ?.setAttribute("data-edit", "userInfo");
            const userInfoInputs = document.querySelectorAll(
                ".user-info li input"
            );
            userInfoInputs.forEach((el: HTMLInputElement) => {
                el.disabled = !el.disabled;
            });
        });
    // Edit User Info End

    document
        .querySelector(".modal.change-avatar form")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            // TODO: fix it
            // const error = document.querySelector<HTMLElement>(
            //     ".modal.change-avatar .error"
            // );

            // if (error) {
            //     if (e.target?.[0]?.files[0]) {
            //         error.style.display = "none";
            //     } else {
            //         error.style.display = "block";
            //     }
            // }
        });

    document
        .querySelector('.modal.change-avatar form [name="avatar"]')
        ?.addEventListener("change", (e) => {
            const target = e.target as HTMLInputElement;

            const image = target.files?.[0];
            // const filename = target.parentElement?.querySelector(".filename");
            const filename = document.querySelector<HTMLElement>(
                ".modal.change-avatar form .filename"
            );

            if (filename) {
                const label = document.querySelector<HTMLInputElement>(
                    ".modal.change-avatar .label"
                );
                const title = document.querySelector<HTMLInputElement>(
                    ".modal.change-avatar .title"
                );
                const errorTitle = document.querySelector<HTMLInputElement>(
                    ".modal.change-avatar .error-title"
                );

                if (image?.type?.split("/")[0] === "image") {
                    filename.innerHTML = image?.name ?? "";
                    filename.style.display = "block";

                    if (label) {
                        label.style.display = "none";
                    }

                    if (title) {
                        title.style.display = "block";
                    }

                    if (errorTitle) {
                        errorTitle.style.display = "none";
                    }
                } else {
                    if (filename) {
                        filename.style.display = "none";
                    }

                    if (label) {
                        label.style.display = "block";
                    }

                    if (title) {
                        title.style.display = "none";
                    }

                    if (errorTitle) {
                        errorTitle.style.display = "block";
                    }
                }
            }

            return false;
        });
};

export default class Account extends Block {
    componentDidMount() {
        scripts();
    }

    render() {
        return this.compile(tpl, this.props);
    }
}
