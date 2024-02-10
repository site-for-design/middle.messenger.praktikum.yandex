const addEventListenerAll = (elems, type, callback) => {
    elems.forEach(elem => {
        elem.addEventListener(type, callback)
    });
}
export default addEventListenerAll;