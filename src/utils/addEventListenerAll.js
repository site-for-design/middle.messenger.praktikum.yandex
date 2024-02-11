export default (elems, type, callback) => {
    elems.forEach(elem => {
        elem.addEventListener(type, callback)
    });
};