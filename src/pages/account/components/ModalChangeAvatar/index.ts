import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Modal from "../../../../components/Modal";
import Title from "../../../../components/Title";
import InputFile from "../../../../components/InputFile";

const DEFAULT_TITLE_TEXT = "Загрузите файл";
const DEFAULT_INPUT_FILE_TEXT = "Выбрать файл на <br>компьютере";

const TitleModal = new Title({ text: DEFAULT_TITLE_TEXT }, "h3");

let inputFileValue: FileList | null = null;

const InputFileModal = new InputFile(
    {
        name: "avatar",
        accept: "image/*",
        text: DEFAULT_INPUT_FILE_TEXT,
        onChange: (e: Event, isValid: boolean) => {
            if (isValid) {
                TitleModal.element?.classList.remove("error");

                const target = e.target as HTMLInputElement;
                const files = target?.files;

                if (files && files.length > 0) {
                    inputFileValue = files;
                }

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

const ModalChangeAvatar = new Modal({
    content: [
        TitleModal,
        new Form({
            fields: [InputFileModal],
            button: new Button({
                text: "Сохранить",
            }),
            events: {
                submit: (e) => {
                    e.preventDefault();

                    const fr = new FileReader();
                    fr.onload = function () {
                        const image =
                            document.querySelector<HTMLImageElement>(
                                ".account-image"
                            );

                        if (image) {
                            image.src = fr.result as string;
                        }
                    };
                    if (inputFileValue) {
                        fr.readAsDataURL(inputFileValue[0]);
                    }

                    ModalChangeAvatar.hide();
                },
            },
        }),
    ],
    attrs: {
        class: "form change-avatar",
    },
});

export default ModalChangeAvatar;
