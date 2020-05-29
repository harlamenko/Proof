import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Text } from 'react-native-elements';
import { AdvertsContext, AuthContext } from '../../context';
import { Layout } from '../../shared/styles';

const { width: screenWidth } = Dimensions.get('window');

class Adverts extends React.Component {
  static contextType = AdvertsContext;
  _prevContext = null;
  _unsubscribe = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setHeader();
      this.tryToLoadAdverts();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const {
      state: { adverts, paging },
    } = this.context;

    if (!adverts.length) {
      return (
        <View style={Layout.centeringContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <FlatList
        data={adverts}
        numColumns={2}
        renderItem={this.renderItem}
        ListFooterComponent={adverts.length < paging.total ? <ActivityIndicator /> : null}
        ListFooterComponentStyle={{ marginVertical: 8 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          this.tryToLoadAdverts();
        }}
        keyExtractor={({ id }) => `${id}`}
      />
    );
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.redirectToDetails(item.id)}
      activeOpacity={0.9}
      style={{ width: '50%' }}
    >
      <Card
        image={{ uri: item.photo }}
        imageProps={{ transition: false }}
        containerStyle={[
          Layout.roundedCorners,
          { overflow: 'hidden', margin: 6, marginVertical: 12 },
        ]}
      >
        <Text style={styles.advertName}>{item.name}</Text>
        <Text style={styles.advertPrice}>{item.price} ₽</Text>
        <Text>г. {item.city}</Text>
        <Text>{item.published_at}</Text>
      </Card>
    </TouchableOpacity>
  );

  redirectToDetails(id) {
    this.props.navigation.navigate('AdvertDetails', { id });
  }

  setHeader() {
    const {
      state: { search },
    } = this.context;

    this.props.navigation.dangerouslyGetParent().setOptions({
      headerShown: true,
      headerLeft: () => {
        return this.props.auth.state.myAdvert ? null : (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('AddAdvert');
            }}
          >
            <Feather name="plus" size={28} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        );
      },
      headerTitle: () => (
        <Text style={styles.title}>
          {search.keyWords ? `Результаты по запросу: "${search.keyWords}"` : 'Объявления'}
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Filter');
          }}
        >
          <Feather name="search" size={28} style={{ marginRight: 8 }} />
        </TouchableOpacity>
      ),
    });
  }

  tryToLoadAdverts() {
    const {
      state: { adverts, paging, search },
      getAdverts,
    } = this.context;
    const prevContextFilter = JSON.stringify(this._prevContext);
    const newContextFilter = JSON.stringify(search);

    if (
      !this._prevContext ||
      prevContextFilter !== newContextFilter ||
      adverts.length < paging.total
    ) {
      getAdverts({ paging, search });
      this._prevContext = JSON.parse(newContextFilter);
    }
  }
}

export default (props) => {
  return (
    <AuthContext.Consumer>{(value) => <Adverts auth={value} {...props} />}</AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  advertPrice: { marginBottom: 6 },
  advertName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    width: screenWidth - 50,
    fontSize: 16,
    marginLeft: 8,
  },
});
