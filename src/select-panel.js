// @flow
/**
 * This component represents the entire panel which gets dropped down when the
 * user selects the component.  It encapsulates the search filter, the
 * Select-all item, and the list of options.
 */
import {filterOptions} from 'fuzzy-match-utils';
import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import SelectItem from './select-item.js';
import SelectList from './select-list.js';
import getString from "./get-string.js";


type Props = {
    ItemRenderer?: Function,
    clearable?: boolean,
    options: Array<any>,
    selected: Array<any>,
    selectAllLabel?: string,
    onSelectedChanged: (selected: Array<any>) => void,
    disabled?: boolean,
    disableSearch?: boolean,
    hasSelectAll: boolean,
    filterOptions?: (options: Array<any>, filter: string) => Array<any>,
    overrideStrings?: {[string]: string},
    labelKey?: string,
    valueKey?: string,
};

type State = {
    searchHasFocus: boolean,
    searchText: string,
    focusIndex: number
};

class SelectPanel extends Component<Props, State> {
    state = {
        searchHasFocus: false,
        searchText: "",
        focusIndex: 0,
    }

    selectAll = () => {
        const {onSelectedChanged, options, valueKey} = this.props;
        const allValues = options.map(o => o[valueKey] || o.value);

        onSelectedChanged(allValues);
    }

    selectNone = () => {
        const {onSelectedChanged} = this.props;

        onSelectedChanged([]);
    }

    selectAllChanged = (checked: boolean) => {
        if (checked) {
            this.selectAll();
        } else {
            this.selectNone();
        }
    }

    handleSearchChange = (e: {target: {value: any}}) => {
        this.setState({
            searchText: e.target.value,
            focusIndex: -1,
        });
    }

    handleItemClicked = (index: number) => {
        this.setState({focusIndex: index});
    }

    clearSearch = (event: {preventDefault: Function}) => {
        event.preventDefault();

        this.setState({searchText: ""});
    }

    handleKeyDown = (e: KeyboardEvent) => {
        console.log(e.which)
        switch (e.which) {
            case 38: // Up Arrow
                if (e.altKey) {
                    return;
                }

                this.updateFocus(-1);
                break;
            case 40: // Down Arrow
                if (e.altKey) {
                    return;
                }

                this.updateFocus(1);
                break;
            default:
                return;
        }

        e.stopPropagation();
        e.preventDefault();
    }

    handleSearchFocus = (searchHasFocus: boolean) => {
        this.setState({
            searchHasFocus,
            focusIndex: -1,
        });
    }

    renderClearButton = () => {
        if (this.props.clearable) {
            return (
                <span>
                    <button type="button" style={styles.button} onClick={this.clearSearch}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </span>
            );
        };
        return null;
    }

    allAreSelected() {
        const {options, selected} = this.props;
        return options.length === selected.length;
    }

    filteredOptions() {
        const {searchText} = this.state;
        const {options, filterOptions: customFilterOptions} = this.props;

        return customFilterOptions ?
            customFilterOptions(options, searchText) :
            filterOptions(options, searchText);
    }

    updateFocus(offset: number) {
        const {focusIndex} = this.state;
        const {options} = this.props;

        let newFocus = focusIndex + offset;
        newFocus = Math.max(0, newFocus);
        newFocus = Math.min(newFocus, options.length);

        this.setState({focusIndex: newFocus});
    }

    render() {
        const {focusIndex, searchHasFocus, searchText} = this.state;
        const {
            ItemRenderer,
            selectAllLabel,
            disabled,
            disableSearch,
            hasSelectAll,
            overrideStrings,
            labelKey,
            valueKey,
        } = this.props;

        const selectAllOption = {
            label: selectAllLabel || getString("selectAll", overrideStrings),
            value: "",
        };

        const focusedSearchStyle = searchHasFocus
            ? styles.searchFocused
            : undefined;

        return <div
            className="select-panel"
            style={styles.panel}
            role="listbox"
            onKeyDown={this.handleKeyDown}
        >
            {!disableSearch && <div style={styles.searchContainer}>
                <input
                    placeholder={getString("search", overrideStrings)}
                    type="text"
                    onChange={this.handleSearchChange}
                    style={{...styles.search, ...focusedSearchStyle}}
                    onFocus={() => this.handleSearchFocus(true)}
                    onBlur={() => this.handleSearchFocus(false)}
                    value={searchText}
                />
                {this.renderClearButton()}
            </div>}

            {hasSelectAll &&
              <SelectItem
                  focused={focusIndex === 0}
                  checked={this.allAreSelected()}
                  option={selectAllOption}
                  onSelectionChanged={this.selectAllChanged}
                  onClick={() => this.handleItemClicked(0)}
                  ItemRenderer={ItemRenderer}
                  disabled={disabled}
                  labelKey="label"
                  valueKey="value"
              />
            }

            <SelectList
                {...this.props}
                options={this.filteredOptions()}
                focusIndex={focusIndex - 1}
                onClick={(e, index) => this.handleItemClicked(index + 1)}
                ItemRenderer={ItemRenderer}
                disabled={disabled}
                labelKey={labelKey}
                valueKey={valueKey}
            />
        </div>;
    }
}

const styles = {
    panel: {
        boxSizing : 'border-box',
    },
    search: {
        display: "inline-block",
        maxWidth: "100%",
        borderRadius: "3px",
        boxSizing : 'border-box',
        height: '30px',
        lineHeight: '24px',
        border: '1px solid',
        borderColor: '#dee2e4',
        padding: '10px',
        width: "98%",
        outline: "none",
    },
    button: {
        height: "30px",
        width: "30px",
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        cursor: 'pointer',
    },
    searchContainer: {
        width: "100%",
        boxSizing : 'border-box',
        padding: "0.5em",
    },
};

export default SelectPanel;
