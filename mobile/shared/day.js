import dayjs from "dayjs";
import "dayjs/locale/ru";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
dayjs.locale("ru");

export const format = d => dayjs(d).format('LLL');

export default dayjs;