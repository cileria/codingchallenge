import { IError } from "./types";
import fse from "fs-extra";

const timeStamp = () => {
  const d = new Date();

  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear() - 2000;
  let hour = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();

  const _day = day.toString().length > 1 ? day.toString() : "0" + day;
  const _month = month.toString().length > 1 ? month.toString() : "0" + month;
  const _year = year.toString();
  const _hour = hour.toString().length > 1 ? hour.toString() : "0" + hour;
  const _minute =
    minute.toString().length > 1 ? minute.toString() : "0" + minute;
  const _second =
    second.toString().length > 1 ? second.toString() : "0" + second;

  return `20${_year}-${_month}-${_day} ${_hour}:${_minute}`;
};

export const generateLog = (p: string) => {
  const line = `[server] ${timeStamp()} - ${p} \n`;

  const logFilePath = `${__dirname}/server.log`;
  try {
    fse.appendFile(logFilePath, line, "utf-8");
  } catch (e) {
    console.log(`could not write logfile: ${logFilePath}`);
  }

  return line;
};

export const q = (userInfo: string, p: string | IError) => {
  let str = `User ${userInfo}`;

  if (typeof p === "object" && (p as IError).hasOwnProperty("errorId")) {
    console.log(
      generateLog(`${str} produced error ${p.errorId}: ${p.message}`)
    );
  } else {
    console.log(generateLog(`${str} ${p}`));
  }
};
