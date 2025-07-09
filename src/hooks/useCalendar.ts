import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const useCalendar = ({
	displayMonth,
	onChange,
}: {
	displayMonth: Date;
	onChange: (date: Date) => void;
}) => {
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
		dayjs(displayMonth),
	);

	const handleChangeDate = (date: dayjs.Dayjs) => {
		setSelectedDate(date);
	};

	useEffect(() => {
		onChange(selectedDate.toDate());
	}, [selectedDate, onChange]);

	return {
		selectedDate,
		handleChangeDate,
	};
};
