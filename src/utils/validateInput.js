const ERROR_ELEM_CLASSNAME = "prompt";
const VISIBLE_ERROR_CLASSNAME = "error";

export default (name, validateFc, errorText) => {
 const input = document.querySelector(`[name="${name}"]`);
 const inputWrap = input.parentElement;

 if (inputWrap.getElementsByClassName(ERROR_ELEM_CLASSNAME).length === 0) {
  const errorElem = document.createElement("span");
  errorElem.className = ERROR_ELEM_CLASSNAME;
  errorElem.innerHTML = errorText;
  inputWrap.appendChild(errorElem);
 }

 if (validateFc(input.value)) {
  inputWrap.classList.remove(VISIBLE_ERROR_CLASSNAME);
  return true;
 } else {
  inputWrap.classList.add(VISIBLE_ERROR_CLASSNAME);
  return false;
 }
};
