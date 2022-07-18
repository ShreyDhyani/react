import React, { ReactNode, useEffect } from "react";
import "../../../../tailwind.css";
import { useThemeContext } from "../../../theme/ThemeProvider";
import resolvedStyleProps from "../../../utils/resolvedStyleProps";
import extractStyleProps from "../../../utils/extractStyleProps";
import LabelBase from "../../../atoms/labels/base";
import ScrollableBase from "../../../atoms/scrollables/base";
import useOutsideClicker from "../../../hooks/useOutsideClicker";
import useSelect from "../../../hooks/useSelect";
import { ScrollableBaseProps } from "../../../atoms/scrollables/base";
import { LabelBaseProps } from "../../../atoms/labels/base";

export interface PickerSelectBaseProps {
  labelBaseProps?: LabelBaseProps;
  scrollableBaseProps?: ScrollableBaseProps;
  multiple: false;
  variant?: string;
  selectInputBottom?: any;
  error?: any;
  simpleSelectPickerClasses?: {
    selectedDataClasses?: any;
    optionClasses?: any;
  };
  pickerSelectBaseClasses?: {
    wrapper?: string;
  };
  textInputBaseErrorClasses?: {
    border?: string;
    focus?: string;
    textColor?: string;
    backgroundColor?: string;
    placeholderColor?: string;
  };
  onChange: (value?: string) => void;
  dataSource: (query?: string) => void;
  defaultSelected?: any;
  valueKey: "value";
  defaultOpen?: boolean;
  defaultQuery?: string;
  refresh?: string;
  selectedDataRenderer: any;
  searchRenderer: any;
  optionsRenderer: any;
  closeComponent?: any;
  clearComponent?: any;
  noDataComponent?: any;
}

const PickerSelectBase = React.forwardRef(
  (props: PickerSelectBaseProps, ref) => {
    const theme: any = useThemeContext();
    let allProps = Object.assign({}, props);

    if (props.error) {
      const errorStyleProps = extractStyleProps(
        "textInputBaseErrorClasses",
        ["border", "focus", "textColor", "backgroundColor", "placeholderColor"],
        allProps,
        theme
      );

      let newpickerSelectBaseClasses = {
        ...allProps["pickerSelectBaseClasses"],
        ...errorStyleProps,
      };

      allProps["pickerSelectBaseClasses"] = newpickerSelectBaseClasses;
    }

    const wrappersClassNames = resolvedStyleProps(
      "pickerSelectBaseClasses",
      ["wrapper"],
      props,
      theme
    );

    const {
      open,
      setOpen,
      query,
      setQuery,
      options,
      addOrRemove,
      selected,
      setSelected,
    } = useSelect(
      props.onChange,
      props.dataSource,
      props.defaultSelected,
      props.valueKey,
      props.defaultOpen,
      props.defaultQuery,
      props.refresh
    );

    const visRef = useOutsideClicker(() => {
      setOpen(false);
    });

    console.log(
      "!props.clearComponent && !props.closeComponent",
      !props.clearComponent && !props.closeComponent,
      props.clearComponent,
      !props.clearComponent
    );

    return (
      <>
        <div className="flex items-center justify-between">
          {<LabelBase {...props.labelBaseProps} />}

          {props.clearComponent !== undefined &&
            props.closeComponent !== undefined && (
              <span className="invisible">Placeholder to prevent Jerk</span>
            )}

          {selected.length > 0 && !open && props.clearComponent && (
            <span className="cursor-pointer" onClick={() => setSelected([])}>
              <props.clearComponent />
            </span>
          )}

          {open && props.closeComponent && (
            <span className="cursor-pointer" onClick={() => setOpen(false)}>
              <props.closeComponent />
            </span>
          )}
        </div>
        <div className={wrappersClassNames}>
          {open === false && (
            <div onClick={() => setOpen(true)}>
              {props.selectedDataRenderer && (
                <props.selectedDataRenderer
                  selected={selected}
                  selectedDataClasses={
                    props.simpleSelectPickerClasses?.selectedDataClasses || {}
                  }
                />
              )}
            </div>
          )}

          {open === true && (
            <div className="relative" ref={visRef}>
              {props.searchRenderer && (
                <props.searchRenderer
                  query={query}
                  onSearch={(v: any) => {
                    setQuery(v);
                  }}
                  cancelSearch={() => setOpen(false)}
                />
              )}

              {options.length > 0 && (
                <ScrollableBase {...props.scrollableBaseProps}>
                  <>
                    {options.map((option: any) => (
                      <div
                        onClick={() => {
                          addOrRemove(props.multiple, option);
                        }}
                        key={`option${option.value}`}
                      >
                        {props.optionsRenderer && (
                          <props.optionsRenderer
                            value={option}
                            selected={selected}
                            optionsClasses={
                              props.simpleSelectPickerClasses?.optionClasses ||
                              {}
                            }
                          />
                        )}
                      </div>
                    ))}
                  </>
                </ScrollableBase>
              )}

              {options.length === 0 && (
                <ScrollableBase {...props.scrollableBaseProps}>
                  {props.noDataComponent && <props.noDataComponent />}
                </ScrollableBase>
              )}
            </div>
          )}
        </div>
        {props.error && props.error}
        {!props.error && props.selectInputBottom && props.selectInputBottom}
      </>
    );
  }
);

export default PickerSelectBase;
