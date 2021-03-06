// @flow
/**
 * This component is designed to be a multi-selct component which supports
 * the selection of several items in a picklist.  It was meant to mimic the
 * style of react-select but the multi-select behavior didn't work for our
 * our needs.
 *
 * Arguments:
 * - options: The {value, label}[] options to be displayed
 * - values: The currently selected values []
 * - onSelectedChanged: An event to notify the caller of new values
 * - valueRenderer: A fn to support overriding the message in the component
 * - isLoading: Show a loading indicator
 */
import React, {Component} from 'react';

import Dropdown from './dropdown.js';
import SelectPanel from './select-panel.js';
import getString from './get-string.js';

type Props = {
    options: Array<any>,
    selected: Array<any>,
    onSelectedChanged?: (selected: Array<any>) => void,
    valueRenderer?: (
        selected: Array<any>,
        options: Array<any>
    ) => string,
    ItemRenderer?: Function,
    selectAllLabel?: string,
    isLoading?: boolean,
    disabled?: boolean,
    disableSearch?: boolean,
    shouldToggleOnHover: boolean,
    hasSelectAll: boolean,
    overrideStrings?: {[string]: string},
    labelKey?: string,
    valueKey?: string,
    clearable?: boolean,
    name?: string,
    id?: string,
};

class MultiSelect extends Component<Props> {
    static defaultProps = {
        clearable: false,
        hasSelectAll: true,
        shouldToggleOnHover: false,
        labelKey: "label",
        valueKey: "value",
    }

    getSelectedText() {
        const {options, selected, labelKey, valueKey} = this.props;

        const selectedOptions = selected
            .map(s => options.find(o => (o[valueKey]) === s));
        const selectedLabels = selectedOptions.map(s => s ? (s[labelKey]) : "");

        return selectedLabels.join(", ");
    }

    renderHeader() {
        const {
            options,
            selected,
            valueRenderer,
            overrideStrings,
        } = this.props;

        const noneSelected = selected.length === 0;
        const allSelected = selected.length === options.length;

        const customText = valueRenderer && valueRenderer(selected, options);

        if (noneSelected) {
            return <span style={styles.noneSelected}>
                {customText || getString("selectSomeItems", overrideStrings)}
            </span>;
        }

        if (customText) {
            return <span>{customText}</span>;
        }

        return <span>
            {allSelected
                ? getString("allItemsAreSelected", overrideStrings)
                : this.getSelectedText()
            }
        </span>;
    }

    filterOptions = (options: Array<any>, filter: string) => {
        const optionIncludesText = (option: any) => {
            const label = option[this.props.labelKey] || "";
            return label.toLowerCase().includes(filter.toLowerCase());
        };

        return options.filter(optionIncludesText);
    };

    handleSelectedChanged = (selected: Array<any>) => {
        const {onSelectedChanged, disabled} = this.props;

        if (disabled) {
            return;
        }

        if (onSelectedChanged) {
            onSelectedChanged(selected);
        }
    }

    render() {
        const {
            ItemRenderer,
            clearable,
            options,
            selected,
            selectAllLabel,
            isLoading,
            disabled,
            disableSearch,
            shouldToggleOnHover,
            hasSelectAll,
            overrideStrings,
            labelKey,
            valueKey,
            name,
            id,
        } = this.props;

        return <div className="multi-select">
            <Dropdown
                isLoading={isLoading}
                contentComponent={SelectPanel}
                shouldToggleOnHover={shouldToggleOnHover}
                contentProps={{
                    ItemRenderer,
                    clearable,
                    options,
                    selected,
                    hasSelectAll,
                    selectAllLabel,
                    onSelectedChanged: this.handleSelectedChanged,
                    disabled,
                    disableSearch,
                    filterOptions: this.filterOptions,
                    overrideStrings,
                    labelKey,
                    valueKey,
                }}
                name={name}
                id={id}
                disabled={disabled}
            >
                {this.renderHeader()}
            </Dropdown>
        </div>;
    }
}

const styles = {
    noneSelected: {
        color: "#aaa",
    },
};

export default MultiSelect;
export {Dropdown};
