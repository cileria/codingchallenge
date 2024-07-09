export const getNowDate = () => {
  const d = new Date();

  let day = d.getDate() as unknown as string;
  let month = (d.getMonth() + 1) as unknown as string;
  let year = (d.getFullYear() - 2000) as unknown as string;
  let hour = d.getHours() as unknown as string;
  let minute = d.getMinutes() as unknown as string;
  let second = d.getSeconds() as unknown as string;

  day = day.toString().length > 1 ? day.toString() : "0" + day;
  month = month.toString().length > 1 ? month.toString() : "0" + month;
  year = year.toString();
  hour = hour.toString().length > 1 ? hour.toString() : "0" + hour;
  minute = minute.toString().length > 1 ? minute.toString() : "0" + minute;
  second = second.toString().length > 1 ? second.toString() : "0" + second;

  return `20${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export const generateLog = (p: string) => {
  return "[server] " + getNowDate() + " - " + p;
};

const q = (p: string) => {
  console.log(generateLog(p));
};

export default q;
