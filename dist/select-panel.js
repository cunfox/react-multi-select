'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fuzzyMatchUtils = require('fuzzy-match-utils');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFontawesome = require('@fortawesome/react-fontawesome');

var _freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');

var _selectItem = require('./select-item.js');

var _selectItem2 = _interopRequireDefault(_selectItem);

var _selectList = require('./select-list.js');

var _selectList2 = _interopRequireDefault(_selectList);

var _getString = require('./get-string.js');

var _getString2 = _interopRequireDefault(_getString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/**
 * This component represents the entire panel which gets dropped down when the
 * user selects the component.  It encapsulates the search filter, the
 * Select-all item, and the list of options.
 */


var SelectPanel = function (_Component) {
    _inherits(SelectPanel, _Component);

    function SelectPanel() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SelectPanel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SelectPanel.__proto__ || Object.getPrototypeOf(SelectPanel)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            searchHasFocus: false,
            searchText: ""
        }, _this.selectAll = function () {
            var _this$props = _this.props,
                onSelectedChanged = _this$props.onSelectedChanged,
                options = _this$props.options,
                valueKey = _this$props.valueKey;

            var allValues = options.map(function (o) {
                return o[valueKey] || o.value;
            });

            onSelectedChanged(allValues);
        }, _this.selectNone = function () {
            var onSelectedChanged = _this.props.onSelectedChanged;


            onSelectedChanged([]);
        }, _this.selectAllChanged = function (checked) {
            if (checked) {
                _this.selectAll();
            } else {
                _this.selectNone();
            }
        }, _this.handleSearchChange = function (e) {
            _this.setState({
                searchText: e.target.value,
                focusIndex: -1
            });
        }, _this.handleItemClicked = function (index) {
            _this.setState({ focusIndex: index });
        }, _this.clearSearch = function (event) {
            event.preventDefault();

            _this.setState({ searchText: "" });
        }, _this.handleSearchFocus = function (searchHasFocus) {
            _this.setState({
                searchHasFocus: searchHasFocus
            });
        }, _this.handleKeyDown = function (e) {
            switch (e.which) {
                case 38: // Up Arrow
                case 40:
                    // Down Arrow
                    if (e.altKey) {
                        return;
                    }
                    break;
                default:
                    return;
            }

            e.stopPropagation();
            e.preventDefault();
        }, _this.renderClearButton = function () {
            if (_this.props.clearable) {
                return _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement(
                        'button',
                        { type: 'button', style: styles.button, onClick: _this.clearSearch },
                        _react2.default.createElement(_reactFontawesome.FontAwesomeIcon, { icon: _freeSolidSvgIcons.faTimes })
                    )
                );
            };
            return null;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SelectPanel, [{
        key: 'allAreSelected',
        value: function allAreSelected() {
            var _props = this.props,
                options = _props.options,
                selected = _props.selected;

            return options.length === selected.length;
        }
    }, {
        key: 'filteredOptions',
        value: function filteredOptions() {
            var searchText = this.state.searchText;
            var _props2 = this.props,
                options = _props2.options,
                customFilterOptions = _props2.filterOptions;


            return customFilterOptions ? customFilterOptions(options, searchText) : (0, _fuzzyMatchUtils.filterOptions)(options, searchText);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                focusIndex = _state.focusIndex,
                searchHasFocus = _state.searchHasFocus,
                searchText = _state.searchText;
            var _props3 = this.props,
                ItemRenderer = _props3.ItemRenderer,
                selectAllLabel = _props3.selectAllLabel,
                disabled = _props3.disabled,
                disableSearch = _props3.disableSearch,
                hasSelectAll = _props3.hasSelectAll,
                overrideStrings = _props3.overrideStrings,
                labelKey = _props3.labelKey,
                valueKey = _props3.valueKey;


            var selectAllOption = {
                label: selectAllLabel || (0, _getString2.default)("selectAll", overrideStrings),
                value: ""
            };

            var focusedSearchStyle = searchHasFocus ? styles.searchFocused : undefined;

            return _react2.default.createElement(
                'div',
                {
                    className: 'select-panel',
                    style: styles.panel,
                    role: 'listbox',
                    onKeyDown: this.handleKeyDown
                },
                !disableSearch && _react2.default.createElement(
                    'div',
                    { style: styles.searchContainer },
                    _react2.default.createElement('input', {
                        placeholder: (0, _getString2.default)("search", overrideStrings),
                        type: 'text',
                        onChange: this.handleSearchChange,
                        style: _extends({}, styles.search, focusedSearchStyle),
                        onFocus: function onFocus() {
                            return _this2.handleSearchFocus(true);
                        },
                        value: searchText
                    }),
                    this.renderClearButton()
                ),
                hasSelectAll && _react2.default.createElement(_selectItem2.default, {
                    checked: this.allAreSelected(),
                    option: selectAllOption,
                    onSelectionChanged: this.selectAllChanged,
                    onClick: function onClick() {
                        return _this2.handleItemClicked(0);
                    },
                    ItemRenderer: ItemRenderer,
                    disabled: disabled,
                    labelKey: 'label',
                    valueKey: 'value'
                }),
                _react2.default.createElement(_selectList2.default, _extends({}, this.props, {
                    options: this.filteredOptions(),
                    onClick: function onClick(e, index) {
                        return _this2.handleItemClicked(index + 1);
                    },
                    ItemRenderer: ItemRenderer,
                    disabled: disabled,
                    labelKey: labelKey,
                    valueKey: valueKey
                }))
            );
        }
    }]);

    return SelectPanel;
}(_react.Component);

var styles = {
    panel: {
        boxSizing: 'border-box'
    },
    search: {
        display: "inline-block",
        maxWidth: "100%",
        borderRadius: "3px",
        boxSizing: 'border-box',
        height: '30px',
        lineHeight: '24px',
        border: '1px solid',
        borderColor: '#dee2e4',
        padding: '10px',
        width: "98%",
        outline: "none"
    },
    button: {
        height: "30px",
        width: "30px",
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        cursor: 'pointer'
    },
    searchFocused: {
        borderColor: "#66afe9",
        boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)"
    },
    searchContainer: {
        width: "100%",
        boxSizing: 'border-box',
        padding: "0.5em"
    }
};

exports.default = SelectPanel;