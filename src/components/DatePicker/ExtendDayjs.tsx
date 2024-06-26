import { Dayjs } from "dayjs";
// import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import "antd/es/date-picker/style/index";

const DatePickerExtend = generatePicker<Dayjs>(dayjsGenerateConfig as any);

export default DatePickerExtend;
