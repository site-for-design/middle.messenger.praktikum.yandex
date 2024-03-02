const ERROR_ELEM_CLASSNAME = "prompt";
const VISIBLE_ERROR_CLASSNAME = "error";

const validateInput = (
    validateFc: (val?: string) => boolean,
    errorText: string,
    input?: HTMLInputElement
) => {
    const inputWrap = input?.parentElement;

    if (inputWrap?.getElementsByClassName(ERROR_ELEM_CLASSNAME).length === 0) {
        const errorElem = document.createElement("span");
        errorElem.className = ERROR_ELEM_CLASSNAME;
        errorElem.textContent = errorText;
        inputWrap?.appendChild(errorElem);
    }

    if (validateFc(input?.value)) {
        inputWrap?.classList.remove(VISIBLE_ERROR_CLASSNAME);
        return true;
    } else {
        inputWrap?.classList.add(VISIBLE_ERROR_CLASSNAME);
        return false;
    }
};

export default validateInput;
