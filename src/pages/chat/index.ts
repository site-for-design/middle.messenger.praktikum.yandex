import { compile } from "handlebars";
import tpl from "./tpl.hbs?raw";
import addEventListenerAll from "../../utils/addEventListenerAll";
import account from "../account";
import "./styles.scss";

export default (props = {}) => {
    const accountInstance = account();

    const script = () => {
        addEventListenerAll(
            document.querySelectorAll('[data-click="toggleAccountVisibility"]'),
            "click",
            () => {
                const accountModal = document.querySelector("section#account");
                accountModal?.classList.toggle("active");
            }
        );

        document
            .querySelector('textarea[name="message"]')
            ?.addEventListener("input", function (e) {
                const target = <HTMLElement>e.target;
                target.style.height = "5px";
                target.style.height = target.scrollHeight + "px";
            });
        {
            const overlay = document.querySelector(".overlay");

            overlay?.addEventListener("click", () => {
                const modal = document.querySelector(`.modal.active`);
                modal?.classList.toggle("active");
                overlay?.classList.toggle("active");
            });

            addEventListenerAll(
                document.querySelectorAll('[data-click="changeAvatar"]'),
                "click",
                () => {
                    const modal =
                        document.querySelector(`.modal.change-avatar`);
                    modal?.classList.toggle("active");
                    overlay?.classList.toggle("active");
                }
            );
            addEventListenerAll(
                document.querySelectorAll('[data-click="addUser"]'),
                "click",
                () => {
                    const modal = document.querySelector(`.modal.add-user`);
                    modal?.classList.toggle("active");
                    overlay?.classList.toggle("active");
                }
            );
            addEventListenerAll(
                document.querySelectorAll('[data-click="removeUser"]'),
                "click",
                () => {
                    const modal = document.querySelector(`.modal.remove-user`);
                    modal?.classList.toggle("active");
                    overlay?.classList.toggle("active");
                }
            );
        }

        addEventListenerAll(
            document.querySelectorAll('[data-click="toggleAccountVisibility"]'),
            "click",
            () => {
                const accountModal = document.querySelector("section#account");
                accountModal?.classList.toggle("active");
            }
        );
    };

    return {
        html: compile(tpl)(props) + accountInstance.html,
        js: () => {
            script();
            accountInstance.js();
        },
    };
};
