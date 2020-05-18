import React from 'react';
import { Text } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat'
import { View } from 'react-native';
import { Layout } from '../../shared/styles';

export default class Chat extends React.Component {
    state = {
        messages: [],
    }

    constructor(props) { super(props); }

    componentDidMount() {
        this._hideHeader();

        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ],
        })
    }

    componentWillUnmount() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: true,
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    _hideHeader = () => {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: false,
        });
    }

    render() {
        this._hideHeader();

        return (
            <View style={Layout.centeringContainer}>
                <Text h4>Список диалогов пуст.</Text>
            </View>
        )

        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        )
    }

}
