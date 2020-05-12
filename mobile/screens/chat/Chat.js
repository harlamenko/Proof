import React from 'react';
import { Text } from 'react-native-elements';

export default class Chat extends React.Component {
    constructor(props) { super(props); }

    componentDidMount() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: false,
        });
    }

    componentWillUnmount() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: true,
        });
    }

    render() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: false,
        });
        return <Text>Chat</Text>
    }
}