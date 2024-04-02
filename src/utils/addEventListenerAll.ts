const addEventListenerAll = (
  elems: NodeListOf<Element>,
  type: string,
  callback: EventListenerOrEventListenerObject,
) => {
  elems.forEach((elem) => {
    elem.addEventListener(type, callback);
  });
};

export default addEventListenerAll;
