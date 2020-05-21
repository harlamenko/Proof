import React from 'react';
import { Avatar, Text, ListItem, Button } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat'
import { View, ActivityIndicator } from 'react-native';
import { Layout } from '../../shared/styles';
import { AuthContext, ChatContext } from '../../context';
import { Message } from '../../models/Message';
import locale_ru from 'dayjs/locale/ru'
import { BackBtn } from '../../components';

class Chat extends React.Component {
    static contextType = ChatContext;
    state = {
        messages: [],
    }

    constructor(props) { super(props); }

    componentDidMount() {
        this._setHeader();
    }

    _onSend(messages = []) {
        messages.forEach(m => {
            const { state: { currentConversation }, sendMessage } = this.context;
            const {
                _id: conversation = null,
                buyer = this.props.auth.state.user.id,
                seller = null,
                advert = null,
            } = currentConversation || {};

            sendMessage({
                seller, buyer, advert,
                msg: new Message({ ...m, conversation })
            });
        })

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    _setHeader = () => {
        const { state: { currentConversation } } = this.context;
        const {
            photo = null,
            email = null
        } = currentConversation.seller;

        this.props.navigation.setOptions({
            headerTitle: () => <Text style={{ fontSize: 16 }}>{email}</Text>,
            headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />,
            headerRight: () => (
                <Avatar
                    rounded
                    source={{ uri: photo }}
                    icon={{ name: 'user', type: 'feather' }}
                    containerStyle={{ marginRight: 8 }}
                />
            )
        });
    }

    componentDidUpdate() {
        this._setHeader();

        const {
            state: { currentConversation, messages, loading },
            getMessages
        } = this.context;

        if (currentConversation._id && !messages && !loading) {
            getMessages(currentConversation._id);
        }

        if (messages && messages.length > this.state.messages.length) {
            this.setState({ messages });
        }
    }

    render() {
        const {
            state: { currentConversation, loading }
        } = this.context;

        if (loading) {
            return (
                <View style={Layout.centeringContainer}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }

        const { advert = {} } = currentConversation;

        return (
            <>
                <View>
                    <ListItem
                        leftAvatar={{
                            rounded: false,
                            source: { uri: advert.photos[0].photo },
                            icon: { name: 'camera', type: 'feather' },
                            onPress: () => {
                                this.props.navigation.navigate("AdvertDetails", { advert: item.advert });
                            }
                        }}
                        title={advert.name}
                        subtitle={`${advert.price} ₽`}
                        rightIcon={{ containerStyle: { display: "none" } }}
                        rightContentContainerStyle={{ backgroundColor: 'red' }}
                        rightElement={
                            <Button title="Открыть сделку" />
                        }
                    />
                </View>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this._onSend(messages)}
                    timeFormat="LLL"
                    locale={locale_ru}
                    placeholder="Напишите сообщение..."
                    user={{
                        _id: this.props.auth.state.user.id,
                    }}
                />
            </>
        )
    }
}

export default (props) => (
    <AuthContext.Consumer>
        {value => <Chat auth={value} {...props} />}
    </AuthContext.Consumer>
)
