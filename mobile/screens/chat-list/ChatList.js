import React from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import { Layout } from '../../shared/styles';
import { ChatContext, AuthContext } from '../../context';
import { SafeAreaView } from 'react-native-safe-area-context';

class ChatList extends React.Component {
    static contextType = ChatContext;

    constructor(props) { super(props); }

    componentDidMount() {
        this._hideHeader();
        this.context.getConversations();
    }

    componentWillUnmount() {
        this.context.clearEmptyMessage();

        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: true,
        });
    }

    _hideHeader = () => {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: false,
        });
    }

    render() {
        this._hideHeader();

        const { state: { conversations, loading, emptyMessage } } = this.context;

        if (!conversations && !emptyMessage || loading) {
            return (
                <View style={Layout.centeringContainer}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }

        if (emptyMessage) {
            return (
                <View style={Layout.centeringContainer}>
                    <Text h4>{emptyMessage}</Text>
                </View>
            )
        }

        const { navigation, auth: { state: user } } = this.props;

        return (
            <SafeAreaView>
                <FlatList
                    keyExtractor={item => item._id}
                    data={conversations}
                    renderItem={({ item }) => (
                        <ListItem
                            title={item.user_id === user.id ? item.buyer.email : item.seller.email}
                            containerStyle={{ paddingVertical: 18 }}
                            subtitle={item.last_message}
                            titleProps={{ numberOfLines: 1 }}
                            subtitleProps={{ numberOfLines: 1 }}
                            leftAvatar={{
                                rounded: false,
                                source: { uri: item.advert.photo },
                                icon: { name: 'camera', type: 'feather' },
                                onPress: () => {
                                    navigation.navigate("AdvertDetails", { advert: item.advert });
                                }
                            }}
                            leftIcon={{ name: 'user', type: 'feather' }}
                            rightElement={(
                                <Text style={styles.date}>
                                    {item.updated_at}
                                </Text>
                            )}
                            bottomDivider
                            onPress={() => {
                                this.context.tryGetConversation(item);
                                navigation.navigate('Chat');
                            }}
                        />
                    )}
                />
            </SafeAreaView>
        )
    }
}

export default (props) => (
    <AuthContext.Consumer>
        {value => <ChatList auth={value} {...props} />}
    </AuthContext.Consumer>
)

const styles = StyleSheet.create({
    date: {
        position: 'absolute',
        bottom: 2,
        right: 8,
        marginTop: -16,
        fontSize: 12
    }
})