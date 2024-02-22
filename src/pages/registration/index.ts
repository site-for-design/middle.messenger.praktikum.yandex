import { compile } from "handlebars";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";
import validateInput from "../../utils/validateInput";
import {
    EMAIL_REGEX,
    PHONE_REGEX,
    PASSWORD_REGEX,
} from "../../constants/constants";

export default (props = {}) => {
    const script = () => {
        document
            .querySelector(".form")
            ?.addEventListener("submit", function (e) {
                e.preventDefault();

                const isFormValid =
                    [
                        validateInput(
                            "email",
                            (val) => !!val?.match(EMAIL_REGEX),
                            "Неверная почта"
                        ),
                        validateInput(
                            "phone",
                            (val) => !!val?.match(PHONE_REGEX),
                            "Неверный телефон"
                        ),
                        validateInput(
                            "password",
                            (val) => !!val?.match(PASSWORD_REGEX),
                            "Минимум 8 символов"
                        ),
                        validateInput(
                            "password_2",
                            (val) =>
                                val ===
                                (<HTMLInputElement>(
                                    document.querySelector(
                                        'input[name="password"]'
                                    )
                                )).value,
                            "Пароли не совпадают"
                        ),
                    ].filter((val) => !val).length === 0;

                if (isFormValid) {
                    alert("Вы успешно зарегестрированы!");
                }
            });
    };

    return {
        html: compile(tpl)(props),
        js: script,
    };
};
