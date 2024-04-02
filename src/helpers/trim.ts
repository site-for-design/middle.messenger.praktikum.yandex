export default function trim(string: string, chars?: string) {
  const str = " " + string + " ";

  if (str && chars === undefined) {
    return string.trim();
  }

  if (!str || !chars) {
    return string || "";
  }

  const regFirst = new RegExp(` ${chars}`, "gi");
  const regSecond = new RegExp(`${chars} `, "gi");

  return str.replace(regFirst, "").replace(regSecond, "").trim();
}
