'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dropdown = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dropdown = require('./dropdown.js');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _selectPanel = require('./select-panel.js');

var _selectPanel2 = _interopRequireDefault(_selectPanel);

var _getString = require('./get-string.js');

var _getString2 = _interopRequireDefault(_getString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
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


var MultiSelect = function (_Component) {
    _inherits(MultiSelect, _Component);

    function MultiSelect() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MultiSelect);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MultiSelect.__proto__ || Object.getPrototypeOf(MultiSelect)).call.apply(_ref, [this].concat(args))), _this), _this.filterOptions = function (options, filter) {
            var optionIncludesText = function optionIncludesText(option) {
                var label = option[_this.props.labelKey] || "";
                return label.toLowerCase().includes(filter.toLowerCase());
            };

            return options.filter(optionIncludesText);
        }, _this.handleSelectedChanged = function (selected) {
            var _this$props = _this.props,
                onSelectedChanged = _this$props.onSelectedChanged,
                disabled = _this$props.disabled;


            if (disabled) {
                return;
            }

            if (onSelectedChanged) {
                onSelectedChanged(selected);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MultiSelect, [{
        key: 'getSelectedText',
        value: function getSelectedText() {
            var _props = this.props,
                options = _props.options,
                selected = _props.selected,
                labelKey = _props.labelKey,
                valueKey = _props.valueKey;


            var selectedOptions = selected.map(function (s) {
                return options.find(function (o) {
                    return o[valueKey] === s;
                });
            });
            var selectedLabels = selectedOptions.map(function (s) {
                return s ? s[labelKey] : "";
            });

            return selectedLabels.join(", ");
        }
    }, {
        key: 'renderHeader',
        value: function renderHeader() {
            var _props2 = this.props,
                options = _props2.options,
                selected = _props2.selected,
                valueRenderer = _props2.valueRenderer,
                overrideStrings = _props2.overrideStrings;


            var noneSelected = selected.length === 0;
            var allSelected = selected.length === options.length;

            var customText = valueRenderer && valueRenderer(selected, options);

            if (noneSelected) {
                return _react2.default.createElement(
                    'span',
                    { style: styles.noneSelected },
                    customText || (0, _getString2.default)("selectSomeItems", overrideStrings)
                );
            }

            if (customText) {
                return _react2.default.createElement(
                    'span',
                    null,
                    customText
                );
            }

            return _react2.default.createElement(
                'span',
                null,
                allSelected ? (0, _getString2.default)("allItemsAreSelected", overrideStrings) : this.getSelectedText()
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props,
                ItemRenderer = _props3.ItemRenderer,
                clearable = _props3.clearable,
                options = _props3.options,
                selected = _props3.selected,
                selectAllLabel = _props3.selectAllLabel,
                isLoading = _props3.isLoading,
                disabled = _props3.disabled,
                disableSearch = _props3.disableSearch,
                shouldToggleOnHover = _props3.shouldToggleOnHover,
                hasSelectAll = _props3.hasSelectAll,
                overrideStrings = _props3.overrideStrings,
                labelKey = _props3.labelKey,
                valueKey = _props3.valueKey,
                name = _props3.name,
                id = _props3.id;


            return _react2.default.createElement(
                'div',
                { className: 'multi-select' },
                _react2.default.createElement(
                    _dropdown2.default,
                    {
                        isLoading: isLoading,
                        contentComponent: _selectPanel2.default,
                        shouldToggleOnHover: shouldToggleOnHover,
                        contentProps: {
                            ItemRenderer: ItemRenderer,
                            clearable: clearable,
                            options: options,
                            selected: selected,
                            hasSelectAll: hasSelectAll,
                            selectAllLabel: selectAllLabel,
                            onSelectedChanged: this.handleSelectedChanged,
                            disabled: disabled,
                            disableSearch: disableSearch,
                            filterOptions: this.filterOptions,
                            overrideStrings: overrideStrings,
                            labelKey: labelKey,
                            valueKey: valueKey
                        },
                        name: name,
                        id: id,
                        disabled: disabled
                    },
                    this.renderHeader()
                )
            );
        }
    }]);

    return MultiSelect;
}(_react.Component);

MultiSelect.defaultProps = {
    clearable: false,
    hasSelectAll: true,
    shouldToggleOnHover: false,
    labelKey: "label",
    valueKey: "value"
};


var styles = {
    noneSelected: {
        color: "#aaa"
    }
};

exports.default = MultiSelect;
exports.Dropdown = _dropdown2.default;