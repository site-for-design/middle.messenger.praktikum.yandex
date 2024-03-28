import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Modal from "../../../../components/Modal";
import Title from "../../../../components/Title";
import InputFile from "../../../../components/InputFile";
import { changeUserAvatar } from "../../../../api/users";
import Unit from "../../../../components/Unit";
import { store } from "../../../../services/Store";

const DEFAULT_TITLE_TEXT = "Загрузите файл";
const DEFAULT_INPUT_FILE_TEXT = "Выбрать файл на <br>компьютере";

const TitleModal = new Title({ text: DEFAULT_TITLE_TEXT }, "h3");

const InputFileModal = new InputFile(
    {
        name: "avatar",
        accept: "image/gif, image/webp, image/jpg, image/jpeg, image/png",
        text: DEFAULT_INPUT_FILE_TEXT,
        onChange: (e: Event, isValid: boolean) => {
            if (isValid) {
                TitleModal.element?.classList.remove("error");

                const target = e.target as HTMLInputElement;
                const files = target?.files;
                formChangeAvatar.setProps({ file: files?.[0] });

                TitleModal.setProps({
                    text: "Файл загружен",
                });

                InputFileModal.setProps({
                    text: [...(files ?? [])]
                        .map((file) => file.name)
                        .join(", "),
                });
            } else {
                TitleModal.setProps({
                    text: "Неверный формат файла",
                });

                TitleModal.element?.classList.add("error");

                InputFileModal.setProps({
                    text: DEFAULT_INPUT_FILE_TEXT,
                });
            }
        },
    },
    "label"
);

const formChangeAvatar = new Form({
    fields: [InputFileModal],
    button: new Button({
        text: "Сохранить",
    }),
    events: {
        submit: async (e: SubmitEvent) => {
            e.preventDefault();
            const formData = new FormData();
            if (formChangeAvatar.props.file) {
                formData.append("avatar", formChangeAvatar.props.file as Blob);
            }

            try {
                const user = await changeUserAvatar(formData);
                store.set("user", user);
                // TODO: set store to update avatar here
                formChangeAvatar.setProps({
                    footer: new Unit(),
                });
                ModalChangeAvatar.hide();

                (formChangeAvatar._element as HTMLFormElement).reset();
                TitleModal.setProps({
                    text: DEFAULT_TITLE_TEXT,
                });
                InputFileModal.setProps({
                    text: DEFAULT_INPUT_FILE_TEXT,
                });
            } catch (e) {
                TitleModal.setProps({
                    text: "Файл не загружен",
                });
                formChangeAvatar.setProps({
                    footer: new Unit(
                        {
                            content: "Файл не загружен, попробуйте другой",
                            attrs: { class: "error-message red" },
                        },
                        "span"
                    ),
                });
            }
        },
    },
    attrs: {
        enctype: "multipart/form-data",
    },
});

const ModalChangeAvatar = new Modal({
    content: [TitleModal, formChangeAvatar],
    attrs: {
        class: "form change-avatar",
    },
});

export default ModalChangeAvatar;
