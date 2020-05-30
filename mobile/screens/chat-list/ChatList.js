import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Badge, ListItem, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';
import httpClient from '../../api/ProofAPI';
import { AuthContext, ChatContext } from '../../context';
import { Layout } from '../../shared/styles';

class ChatList extends React.Component {
  static contextType = ChatContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._hideHeader();
    this.context.getConversations();
    this.socket = io(httpClient.defaults.baseURL);
    const { updateConversations } = this.context;
    const {
      auth: { state: user },
    } = this.props;

    this.socket.on(user._id, (conversation) => {
      updateConversations(conversation);
    });
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
  };

  render() {
    this._hideHeader();

    const {
      state: { conversations, loading, emptyMessage },
    } = this.context;

    if ((!conversations && !emptyMessage) || loading) {
      return (
        <View style={Layout.centeringContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (emptyMessage) {
      return (
        <View style={Layout.centeringContainer}>
          <Text h4>{emptyMessage}</Text>
        </View>
      );
    }

    const {
      navigation,
      auth: {
        state: { user },
      },
    } = this.props;

    return (
      <SafeAreaView>
        <FlatList
          keyExtractor={(item) => item._id}
          data={conversations}
          renderItem={({ item }) => (
            <ListItem
              title={
                item.advert.user_id === user.id
                  ? item.buyer.name || item.buyer.email
                  : item.seller.name || item.seller.email
              }
              containerStyle={{ paddingVertical: 12 }}
              subtitle={item.last_message}
              titleProps={{ numberOfLines: 1 }}
              subtitleProps={{ numberOfLines: 1 }}
              leftAvatar={{
                size: 'medium',
                rounded: false,
                source: { uri: item.advert.photo },
                icon: { name: 'camera', type: 'feather' },
                onPress: () => {
                  navigation.navigate('AdvertDetails', { advert: item.advert });
                },
              }}
              leftIcon={{ name: 'user', type: 'feather' }}
              rightIcon={
                item.unread_count ? (
                  <Badge
                    status="primary"
                    value={item.unread_count}
                    containerStyle={{ marginRight: -26 }}
                  />
                ) : null
              }
              rightElement={<Text style={styles.date}>{item.updated_at}</Text>}
              bottomDivider
              onPress={() => {
                this.context.tryGetConversation(item);
                navigation.navigate('Chat');
              }}
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default (props) => (
  <AuthContext.Consumer>
    {(value) => <ChatList auth={value} {...props} />}
  </AuthContext.Consumer>
);

const styles = StyleSheet.create({
  date: {
    position: 'absolute',
    bottom: 2,
    right: 8,
    marginTop: -16,
    fontSize: 12,
  },
});
