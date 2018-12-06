// @flow
/**
 * This component represents an unadorned list of SelectItem (s).
 */
import React, {Component} from 'react';

import SelectItem from './select-item.js';

type Props = {
    focusIndex: number,
    ItemRenderer?: Function,
    options: Array<any>,
    selected: Array<Object>,
    onSelectedChanged: (selected: any) => void,
    onClick: (event: MouseEvent, index: number) => void,
    disabled?: boolean,
    labelKey?: string,
    valueKey?: string,
};

class SelectList extends Component<Props> {
    handleSelectionChanged = (option: any, checked: boolean) => {
        const {selected, onSelectedChanged, disabled, valueKey} = this.props;

        if (disabled) {
            true;
        }

        if (checked) {
            onSelectedChanged([...selected, (option[valueKey] || option.value)]);
        } else {
            const index = selected.indexOf((option[valueKey] || option.value));
            const removed = [
                ...selected.slice(0, index),
                ...selected.slice(index + 1),
            ];
            onSelectedChanged(removed);
        }
    }

    renderItems() {
        const {
            ItemRenderer,
            options,
            selected,
            focusIndex,
            onClick,
            disabled,
            labelKey,
            valueKey,
        } = this.props;

        return options.map((o, i) =>
            <li
                style={styles.listItem}
                key={o.hasOwnProperty("key") ? o.key : i}
            >
                <SelectItem
                    focused={focusIndex === i}
                    option={o}
                    onSelectionChanged={c => this.handleSelectionChanged(o, c)}
                    checked={selected.includes((o[valueKey] || o.value))}
                    onClick={e => onClick(e, i)}
                    ItemRenderer={ItemRenderer}
                    disabled={disabled}
                    labelKey={labelKey}
                    valueKey={valueKey}
                />
            </li>
        );
    }

    render() {
        return <ul
            className="select-list"
            style={styles.list}
        >
            {this.renderItems()}
        </ul>;
    }
}

const styles = {
    list: {
        margin: 0,
        paddingLeft: 0,
    },
    listItem: {
        listStyle: 'none',
    },
};

export default SelectList;
