import React from 'react';
import { Avatar, Text, ListItem, Button } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat'
import { View, ActivityIndicator } from 'react-native';
import { Layout } from '../../shared/styles';
import { AuthContext, ChatContext } from '../../context';
import { Message } from '../../models/Message';
import locale_ru from 'dayjs/locale/ru';
import { BackBtn } from '../../components';
import httpClient from '../../api/ProofAPI';
import io from 'socket.io-client';
import { Conversation } from '../../models/Conversation';

class Chat extends React.Component {
    static contextType = ChatContext;

    state = {
        messages: [],
    }

    constructor(props) { super(props); }

    componentDidMount() {
        const { state: { currentConversation: { seller, buyer } } } = this.context;

        this.myCompanion = this.props.auth.state.user.id === seller._id ? buyer : seller;

        this._setHeader();
        this._connectToSocket();
    }

    _connectToSocket() {
        this.socket = io(httpClient.defaults.baseURL);
        const { state: { currentConversation: { _id: cid } } } = this.context;

        this.socket.on(`${this.myCompanion._id}${cid}`, msg => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, [msg]),
            }));
        });
    }

    _onSend(messages = []) {
        messages.forEach(m => {
            const {
                state: { currentConversation },
                sendMessage,
                updateConversations
            } = this.context;
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
            updateConversations(new Conversation({
                _id: conversation,
                updated_at: m.createdAt,
                last_message: m.text || 'Изображение',
            }));
        });

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    _setHeader = () => {
        const { photo = null, email = null } = this.myCompanion;

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
                {
                    /*TODO: изм при доб логики сделок*/
                    advert.user_id === this.myCompanion._id ?
                        <View>
                            <ListItem
                                leftAvatar={{
                                    rounded: false,
                                    source: { uri: advert.photo },
                                    icon: { name: 'camera', type: 'feather' },
                                    onPress: () => {
                                        this.props.navigation.navigate("AdvertDetails", { advert });
                                    }
                                }}
                                title={advert.name}
                                subtitle={`${advert.price} ₽`}
                                rightElement={<Button title="Открыть сделку" />}
                            />
                        </View> : null
                }
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
