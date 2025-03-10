import moment from "moment-jalaali";
import { useCallback, useMemo } from "react";
import { dateTransformer } from "../../../utils";
import { localizedDayLabels, localizedMonth } from "../../constants";
import { useDatePickerContext } from "../../context/date/dateProvider";

export const useDatepicker = () => {
  const {
    state,
    cacheDate,
    locale: { language } = { language: "fa" },
    onDateChange,
    onMonthchange,
    onYearchange,
    disabledDates,
    onEmptyInputValue,
    ...rest
  } = useDatePickerContext();

  const { isJalaali, dayLabels } = useMemo(() => {
    return {
      isJalaali: language === "fa",
      months: localizedMonth[language || "fa"],
      dayLabels: localizedDayLabels[language || "fa"],
    };
  }, [language]);

  const goToToday = useCallback(() => {
    const today = isJalaali
      ? {
          day: moment().jDate(),
          year: moment().jYear(),
          month: Number(moment().format("jM")),
        }
      : {
          day: moment().date(),
          year: moment().year(),
          month: Number(moment().format("M")),
        };

    const todayInMoment = dateTransformer({ ...today }, isJalaali);
    const isTodayDisabled = disabledDates?.(todayInMoment);

    onEmptyInputValue();

    if (isTodayDisabled) {
      onMonthchange?.({ ...today, day: 0 });
      onYearchange?.({ ...today, day: 0 });
    }
    !isTodayDisabled && onDateChange(today);
  }, [
    disabledDates,
    isJalaali,
    onEmptyInputValue,
    onDateChange,
    onMonthchange,
    onYearchange,
  ]);

  return {
    state,
    onDateChange,
    goToToday,
    isJalaali,
    language,
    dayLabels,
    cacheDate,
    onMonthchange,
    onYearchange,
    ...rest,
  };
};
