// @flow
/**
 * A generic dropdown component.  It takes the children of the component
 * and hosts it in the component.  When the component is selected, it
 * drops-down the contentComponent and applies the contentProps.
 */
import React, {Component} from 'react';
import $ from "jquery";
import LoadingIndicator from './loading-indicator.js';

type Props = {
    children?: Object,
    contentComponent: Object,
    contentProps: Object,
    isLoading?: boolean,
    disabled?: boolean,
    shouldToggleOnHover?: boolean,
    labelKey?: string,
    valueKey?: string,
    name?: string,
    id?: string,
};

type State = {
    expanded: boolean,
    hasFocus: boolean
};

class Dropdown extends Component<Props, State> {
    state = {
        expanded: false,
        hasFocus: false,
    }

    componentWillUpdate() {
        document.addEventListener('touchstart', this.handleDocumentClick);
        document.addEventListener('mousedown', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('touchstart', this.handleDocumentClick);
        document.removeEventListener('mousedown', this.handleDocumentClick);
    }

    wrapper: ?Object

    handleDocumentClick = (event: Event) => {
        const scrollSize = 15;
        const element = $(event.target)
        if(!this.state.expanded) {
            return null;
        }
        if (element[0].scrollHeight > element.height() || element[0].scrollWidth > element.width()) {
            if (event.clientY > element.position().top + element.height() && event.clientY <= element.position().top + element.height() + scrollSize) {
                return null;
            }
            if (event.clientX > element.position().left + element.width() && event.clientX <= element.position().left + element.width() + scrollSize) {
                return null;
            }
        }
        if (!$(this.wrapper).is(event.target) && !this.wrapper.contains(event.target)) {
            this.setState({expanded: false});
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.which) {
            case 27: // Escape
                this.toggleExpanded(false);
                break;
            case 38: // Up Arrow
            case 13: // Enter Key
            case 40: // Down Arrow
                this.toggleExpanded(false);
                break;
            case 32: // Space
                this.toggleExpanded(true);
                return;
            default:
                return;
        }

        e.preventDefault();
    }

    handleFocus = (e: {target: any}) => {
        const {hasFocus} = this.state;

        if (e.target === this.wrapper && !hasFocus) {
            this.setState({hasFocus: true});
        }
    }

    handleBlur = (e: {target: any}) => {
        const {hasFocus} = this.state;

        if (hasFocus) {
            this.setState({hasFocus: false});
        }
    }

    handleMouseEnter = (e: {target: any}) => {
        this.handleHover(true);
    }

    handleMouseLeave = (e: {target: any}) => {
        this.handleHover(false);
    }

    handleHover = (toggleExpanded: boolean) => {
        const {shouldToggleOnHover} = this.props;

        if (shouldToggleOnHover) {
            this.toggleExpanded(toggleExpanded);
        }
    }

    toggleExpanded = (value: ?boolean) => {
        const {isLoading} = this.props;
        const {expanded} = this.state;

        if (isLoading) {
            return;
        }

        const newExpanded = value === undefined ? !expanded : !!value;

        this.setState({expanded: newExpanded});

        if (!newExpanded && this.wrapper) {
            this.wrapper.focus();
        }
    }

    renderPanel() {
        const {contentComponent: ContentComponent, contentProps} = this.props;

        return <div
            className="dropdown-content"
            style={styles.panelContainer}
        >
            <ContentComponent {...contentProps} />
        </div>;
    }

    render() {
        const {expanded, hasFocus} = this.state;
        const {children, isLoading, disabled, name, id} = this.props;

        const expandedHeaderStyle = expanded
            ? styles.dropdownHeaderExpanded
            : undefined;

        const focusedHeaderStyle = hasFocus
            ? styles.dropdownHeaderFocused
            : undefined;

        const arrowStyle = expanded
            ? styles.dropdownArrowUp
            : styles.dropdownArrowDown;

        const focusedArrowStyle = hasFocus
            ? styles.dropdownArrowDownFocused
            : undefined;

        const headingStyle = {
            ...styles.dropdownChildren,
            ...(disabled ? styles.disabledDropdownChildren : {}),
        };

        return <div
            name={name}
            id={id}
            tabIndex="0"
            role="combobox"
            aria-expanded={expanded}
            aria-readonly="true"
            aria-disabled={disabled}
            style={styles.dropdownContainer}
            ref={ref => this.wrapper = ref}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
        >
            <div
                className="dropdown-heading"
                style={{
                    ...styles.dropdownHeader,
                    ...expandedHeaderStyle,
                    ...focusedHeaderStyle,
                }}
                onClick={() => this.toggleExpanded()}
            >
                <span
                    className="dropdown-heading-value"
                    style={headingStyle}
                >
                    {children}
                </span>
                <span
                    className="dropdown-heading-loading-container"
                    style={styles.loadingContainer}
                >
                    {isLoading && <LoadingIndicator />}
                </span>
                <span
                    className="dropdown-heading-dropdown-arrow"
                    style={styles.dropdownArrow}
                >
                    <span style={{
                        ...arrowStyle,
                        ...focusedArrowStyle,
                    }}
                    />
                </span>
            </div>
            {expanded && this.renderPanel()}
        </div>;
    }
}

const styles = {
    dropdownArrow: {
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'table-cell',
        position: 'relative',
        textAlign: 'center',
        verticalAlign: 'middle',
        width: 25,
        paddingRight: 5,
    },
    dropdownArrowDown: {
        boxSizing: 'border-box',
        borderColor: '#999 transparent transparent',
        borderStyle: 'solid',
        borderWidth: '5px 5px 2.5px',
        display: 'inline-block',
        height: 0,
        width: 0,
        position: 'relative',
    },
    dropdownArrowUp: {
        boxSizing: 'border-box',
        top: '-2px',
        borderColor: 'transparent transparent #999',
        borderStyle: 'solid',
        borderWidth: '0px 5px 5px',
        display: 'inline-block',
        height: 0,
        width: 0,
        position: 'relative',
    },
    dropdownChildren: {
        boxSizing: 'border-box',
        bottom: 0,
        color: '#333',
        left: 0,
        lineHeight: '34px',
        paddingLeft: 10,
        paddingRight: 10,
        position: 'absolute',
        right: 0,
        top: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    disabledDropdownChildren: {
        opacity: 0.5,
    },
    dropdownContainer: {
        position: 'relative',
        boxSizing: 'border-box',
        outline: 'none',
    },
    dropdownHeader: {
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        borderColor: '#d9d9d9 #ccc #b3b3b3',
        borderRadius: 4,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        border: '1px solid #ccc',
        color: '#333',
        cursor: 'default',
        display: 'table',
        borderSpacing: 0,
        borderCollapse: 'separate',
        height: 36,
        outline: 'none',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
    },
    dropdownHeaderExpanded: {
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '0px',
    },
    loadingContainer: {
        cursor: 'pointer',
        display: 'table-cell',
        verticalAlign: 'middle',
        width: '16px',
    },
    panelContainer: {
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderTopColor: '#e6e6e6',
        boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)',
        boxSizing: 'border-box',
        marginTop: '-1px',
        maxHeight: '300px',
        position: 'absolute',
        top: '100%',
        width: '100%',
        zIndex: 1,
        overflowY: 'auto',
    },
};

export default Dropdown;
