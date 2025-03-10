import moment from "moment-jalaali";
import { createContext, useContext, useEffect } from "react";
import { dateTransformer, formatGenerator, isEqual } from "../../../utils";
import { DatePickerProps } from "../../interfaces";
import { Date } from "../../types/global.types";
import { DatePropsReducerType } from "../propsReducer";
import { useDatePropsReducer } from "../usePropsReducer";
import { useDateReducer } from "./useDateReducer";

interface DateInputProps {
  value: string;
  placeholder?: string;
  onChangeInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmptyInputValue: () => void;
}

interface ContextType extends DatePropsReducerType {
  state: Date;
  cacheDate?: Date;
  onDateChange: (payload: Date) => void;
  onDaychange: (payload: Date) => void;
  onMonthchange: (payload: Date) => void;
  onYearchange: (payload: Date) => void;
  onIncreaseYear: (payload: Date) => void;
  onDecreaseYear: (payload: Date) => void;
  onIncreaseMonth: (payload: Date) => void;
  onDecreaseMonth: (payload: Date) => void;
  changePlaceholder: (payload: Date | null) => void;
  onEmptyInputValue: () => void;
}

export const DatePickerContext = createContext<ContextType>({
  state: {
    day: 0,
    month: 0,
    year: 0,
  },
  cacheDate: undefined,
  locale: {
    language: "fa",
  },
  changePlaceholder: () => null,
  onDateChange: () => null,
  onDaychange: () => null,
  onMonthchange: () => null,
  onYearchange: () => null,
  onIncreaseYear: () => null,
  onDecreaseYear: () => null,
  onIncreaseMonth: () => null,
  onDecreaseMonth: () => null,
  onEmptyInputValue: () => null,
});

interface DateProviderProps {
  props: DatePickerProps;
  children: React.ReactNode | ((props: DateInputProps) => React.ReactNode);
}

export const DateProvider = ({ children, props }: DateProviderProps) => {
  const language = props ? props.locale?.language || "fa" : "fa";

  const {
    state,
    onDaychange,
    onDateChange,
    onMonthchange,
    onYearchange,
    onIncreaseYear,
    onDecreaseYear,
    onIncreaseMonth,
    onDecreaseMonth,
    changePlaceholder,
    onEmptyInputValue,
    cacheDate,
    inputProps,
  } = useDateReducer({
    language,
    onDayChangeProp: props?.onDayChange,
    onMonthChangeProp: props?.onMonthChange,
    onYearChangeProp: props?.onYearChange,
    onChangeProp: props.onChange,
    formatProp: props.format,
    valueProp: props.value,
  });

  const { setLocale, setFormat, setDisabledDates, propsState } =
    useDatePropsReducer();

  useEffect(() => {
    if (props.locale && !isEqual(props.locale, propsState.locale)) {
      const isJalaali = language === "fa";
      setLocale(props.locale);
      onDaychange({
        day: 0,
        year: isJalaali ? moment().jYear() : moment().year(),
        month: Number(moment().format(isJalaali ? "jM" : "M")),
      });
    }
    if (
      props.disabledDates?.length &&
      !isEqual(props.disabledDates, propsState.disabledDates)
    ) {
      setDisabledDates(props.disabledDates);
    }
    if (
      props.format !== propsState.format ||
      (props.format === undefined && propsState.format === undefined)
    ) {
      const format = props.format
        ? typeof props.format === "function"
          ? props.format(dateTransformer(cacheDate, language === "fa"))
          : props.format
        : formatGenerator(language === "fa");
      setFormat(format);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <DatePickerContext.Provider
      value={{
        state,
        onDateChange,
        onDaychange,
        onMonthchange,
        onYearchange,
        onIncreaseYear,
        onDecreaseYear,
        onIncreaseMonth,
        onDecreaseMonth,
        changePlaceholder,
        onEmptyInputValue,
        cacheDate,
        format: propsState.format,
        ...propsState,
      }}
    >
      {typeof children === "function" ? children(inputProps) : children}
    </DatePickerContext.Provider>
  );
};

export const useDatePickerContext = () => {
  if (typeof DatePickerContext === "undefined") {
    throw new Error(
      "useDatePickerContext must be under DatePickerContext Provider",
    );
  }

  return useContext(DatePickerContext);
};
