// @flow
/**
 * This component represents an individual item in the multi-select drop-down
 */
import React, {Component} from 'react';

type DefaultItemRendererProps = {
    checked: boolean,
    option: any,
    disabled?: boolean,
    labelKey?: string,
    valueKey?: string,

    onClick: (event: MouseEvent) => void
};

class DefaultItemRenderer extends Component<DefaultItemRendererProps> {
    render() {
        const {checked, option, onClick, disabled, labelKey, valueKey} = this.props;

        const style = {
            ...styles.label,
            ...(disabled ? styles.labelDisabled : undefined),
        };

        return <div
            className="item-renderer"
        >
            <input
                type="checkbox"
                onChange={onClick}
                checked={checked}
                tabIndex="-1"
                disabled={disabled}
            />
            <span style={style}>
                {option[labelKey]}
            </span>
        </div>;
    }
}

type SelectItemProps = {
    ItemRenderer: Function,
    option: any,
    checked: boolean,
    disabled?: boolean,
    labelKey: string,
    valueKey: string,
    onSelectionChanged: (checked: boolean) => void,
    onClick: (event: MouseEvent) => void
};
type SelectItemState = {
    hovered: boolean
};

class SelectItem extends Component<SelectItemProps, SelectItemState> {
    static defaultProps = {
        ItemRenderer: DefaultItemRenderer,
    }

    state = {
        hovered: false,
    }

    itemRef: ?HTMLElement

    onChecked = (e: {target: {checked: boolean}}) => {
        const {onSelectionChanged} = this.props;
        const {checked} = e.target;

        onSelectionChanged(checked);
    }

    toggleChecked = () => {
        const {checked, onSelectionChanged} = this.props;
        onSelectionChanged(!checked);
    }

    handleClick = (e: MouseEvent) => {
        const {onClick} = this.props;
        this.toggleChecked();
        onClick(e);
    }


    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.which) {
            case 13: // Enter
            case 32: // Space
                this.toggleChecked();
                break;
            default:
                return;
        }

        e.preventDefault();
    }

    render() {
        const {ItemRenderer, option, checked, focused, disabled, labelKey, valueKey} = this.props;
        const {hovered} = this.state;

        const focusStyle = (focused || hovered)
            ? styles.itemContainerHover
            : undefined;

        return <label
            className="select-item"
            role="option"
            aria-selected={checked}
            selected={checked}
            tabIndex="-1"
            style={{...styles.itemContainer, ...focusStyle}}
            ref={ref => this.itemRef = ref}
            onKeyDown={this.handleKeyDown}
            onMouseOver={() => this.setState({hovered: true})}
            onMouseOut={() => this.setState({hovered: false})}
        >
            <ItemRenderer
                option={option}
                checked={checked}
                onClick={this.handleClick}
                disabled={disabled}
                labelKey={labelKey}
                valueKey={valueKey}
            />
        </label>;
    }
}


const styles = {
    itemContainer: {
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#666666',
        cursor: 'pointer',
        display: 'block',
        padding: '8px 10px',
    },
    itemContainerHover: {
        backgroundColor: '#ebf5ff',
        outline: 0,
    },
    label: {
        display: 'inline-block',
        verticalAlign: 'middle',
        borderBottomRightRadius: '2px',
        borderTopRightRadius: '2px',
        cursor: 'default',
        padding: '2px 5px',
    },
    labelDisabled: {
        opacity: 0.5,
    },
};

export default SelectItem;
