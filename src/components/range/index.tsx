import { ForwardedRef, forwardRef, Ref } from "react";
import { RangePickerProps as Props, RangeProvider } from "../../core";
import RangePanel from "./rangePanel";

interface RangePickerProps extends Props {
  ref?: Ref<HTMLDivElement>;
}

type RangePickerComponent = typeof RangePicker;

const RangePicker = (
  {
    headerRender,
    dayLabelRender,
    panelRender,
    highlightOffDays,
    customColors,
    onModeChange,
    ...restProps
  }: RangePickerProps,
  pickerRef: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <RangeProvider props={restProps}>
      <RangePanel
        ref={pickerRef}
        headerRender={headerRender}
        panelRender={panelRender}
        dayLabelRender={dayLabelRender}
        highlightOffDays={highlightOffDays}
        customColors={customColors}
        onModeChange={onModeChange}
      />
    </RangeProvider>
  );
};

const RangePickerWithRef = forwardRef<HTMLDivElement, RangePickerProps>(
  RangePicker,
) as RangePickerComponent;

export { RangePickerWithRef as RangePicker };
