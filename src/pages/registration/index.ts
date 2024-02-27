import tpl from "./tpl.hbs?raw";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import Block from "../../services/Block";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import "./styles.scss";

class Registration extends Block {
    render() {
        return this.compile(tpl);
    }
}

const RegistrationPage = new Registration({
    form: new Form({
        title: "Регистрация",
        fields: [
            new Input({
                type: "email",
                name: "email",
                isRequired: true,
                text: "Почта",
            }),
            new Input({
                type: "login",
                name: "login",
                isRequired: true,
                text: "Логин",
            }),
            new Input({
                type: "text",
                name: "first_name",
                isRequired: true,
                text: "Имя",
            }),
            new Input({
                type: "text",
                name: "second_name",
                isRequired: true,
                text: "Фамилия",
            }),
            new Input({
                type: "tel",
                name: "phone",
                isRequired: true,
                text: "Телефон",
            }),
            new Input({
                type: "password",
                name: "password",
                isRequired: true,
                text: "Пароль",
            }),
            new Input({
                type: "password",
                name: "password_2",
                isRequired: true,
                text: "Пароль",
            }),
        ],
        button: new Button({
            text: "Регистрация",
        }),
        footer: '<a href="/" class="link">Войти?</a>',
        events: {
            submit: (e) => {
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

                const formData = new FormData(e?.target as HTMLFormElement);

                const data: { [key: string]: FormDataEntryValue } = {};
                formData.forEach((val, key) => {
                    data[key] = val;
                });
                console.log(data);
            },
        },
    }),
});

export default RegistrationPage;
