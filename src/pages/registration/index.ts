import tpl from "./tpl.hbs?raw";
import validateInput from "../../utils/validateInput";
import Block from "../../services/Block";
import * as REGEX from "../../constants/constants";
import "./styles.scss";

const scripts = () => {
    document
        .querySelector("#registration .form")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            const isFormValid =
                [
                    validateInput(
                        "email",
                        (val) => Boolean(val?.match(REGEX.EMAIL_REGEX)),
                        "Неверная почта"
                    ),
                    validateInput(
                        "login",
                        (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
                        "Неверный логин"
                    ),
                    validateInput(
                        "first_name",
                        (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                        "Неверное имя"
                    ),
                    validateInput(
                        "second_name",
                        (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                        "Неверная Фамилия"
                    ),
                    validateInput(
                        "phone",
                        (val) => Boolean(val?.match(REGEX.PHONE_REGEX)),
                        "Неверный телефон"
                    ),
                    validateInput(
                        "password",
                        (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                        "Минимум 8 символов"
                    ),
                    validateInput(
                        "password_2",
                        (val) =>
                            val ===
                            document.querySelector<HTMLInputElement>(
                                'input[name="password"]'
                            )?.value,
                        "Пароли не совпадают"
                    ),
                ].filter((val) => !val).length === 0;

            if (isFormValid) {
                alert("Вы успешно зарегестрированы!");
            }

            const formData = new FormData(e.target as HTMLFormElement);

            const data: { [key: string]: FormDataEntryValue } = {};
            formData.forEach((val, key) => {
                data[key] = val;
            });
            console.log(data);
        });
};

export default class Registration extends Block {
    componentDidMount() {
        scripts();
    }

    render() {
        return this.compile(tpl, { ...this.props });
    }
}
