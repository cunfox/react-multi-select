// @flow
import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';
import SelectItem from '../select-item.js';

const option = {
    label: "one",
    value: 1,
};

type Props = {};
type State = {
    option: any,
    checked: boolean
};

class StatefulSelectItem extends Component<Props, State> {
    constructor() {
        super();
        this.state = {
            option: option,
            checked: false,
        };
    }

    handleChange(checked) {
        this.setState({checked});
    }

    render() {
        const {option, checked} = this.state;

        return <div>
            <SelectItem
                option={option}
                checked={checked}
                onSelectionChanged={this.handleChange.bind(this)}
                onClick={() => {}}
                labelKey="label"
                valueKey="value"
            />

            <h2>Selected:</h2>
            {checked ? 'true' : 'false'}
        </div>;
    }
}

storiesOf('SelectItem', module)
    .add('default view', () => <StatefulSelectItem />);
