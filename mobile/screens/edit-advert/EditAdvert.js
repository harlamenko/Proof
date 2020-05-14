import React, { Component } from "react";
import {
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    View,
} from "react-native";
import { BackBtn, AdvertForm } from "../../components";
import { Feather } from "@expo/vector-icons";
import { AdvertsContext, AuthContext } from "../../context";
import ProofAPI from '../../api/ProofAPI';
import Toast from 'react-native-simple-toast';
import { Advert } from "../../models/Advert";

class EditAdvert extends Component {
    static contextType = AdvertsContext;

    constructor(props) {
        super(props);
        const immutableAdvert = JSON.parse(JSON.stringify(this.props.route.params.advert));

        this.state = {
            item: new Advert(immutableAdvert),
            uploading: false
        };
    }

    setHeader = () => {
        this.props.navigation.setOptions({
            headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />,
            headerTitle: () => <Text style={styles.title}>Редактирование объявления</Text>,
            headerRight: () => {
                return this.state.uploading ?
                    <ActivityIndicator style={{ marginRight: 8 }} /> :
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.save} disabled={this.isNotEdited()}>
                            <Feather
                                name="check"
                                color={this.isNotEdited() ? 'gray' : 'black'}
                                size={28}
                                style={{ marginRight: 8 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.cancel}>
                            <Feather name="x" size={28} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                    </View>
            }
        });
    };

    isNotEdited = () => JSON.stringify(this.props.route.params.advert) === JSON.stringify(this.state.item);

    save = async () => {
        const { item } = this.state;
        const validationMessage = item.validate();

        if (validationMessage) {
            Alert.alert('Ошибка сохранения', validationMessage);
            return;
        }

        this.setState({ ...this.state, ...{ uploading: true } });
        const { data: advert } = await ProofAPI.put(`/adverts/${item.id}`, item);

        if (advert) {
            this.props.auth.setLocalInfo(advert);
            const { dropFilter } = this.context;
            dropFilter();

            const { state: { paging, search }, getAdverts } = this.context;
            getAdverts({ paging, search });
            Toast.showWithGravity('Редактирование прошло успешно!', Toast.SHORT, Toast.CENTER);
            this.props.navigation.navigate("Adverts");
        } else {
            Toast.showWithGravity('Ошибка сохранения', Toast.SHORT, Toast.CENTER);
        }

        this.setState({ ...this.state, ...{ uploading: false } });
    }

    cancel = () => this.props.navigation.canGoBack() && this.props.navigation.goBack();

    handlePhotoAdding = () => {
        const { item } = this.state;
        item.addPhoto();
    }

    handlePhotoAdded = (uri) => {
        const { item } = this.state;
        item.changeLastPhoto(uri);
        this.setState({ ...this.state, item });
    }

    handleNameChange = name => this.setState({
        ...this.state,
        ...this.state.item.patch({ name })
    });

    handlePriceChange = price => this.setState({
        ...this.state,
        ...this.state.item.patch({ price })
    });

    handleCityChange = city => this.setState({
        ...this.state,
        ...this.state.item.patch({ city })
    });

    handleDescriptionChange = description => this.setState({
        ...this.state,
        ...this.state.item.patch({ description })
    });

    render() {
        this.setHeader();

        return (
            <AdvertForm
                advert={this.state.item}
                onPhotoAdding={this.handlePhotoAdding}
                onPhotoAdded={this.handlePhotoAdded}
                onNameChange={this.handleNameChange}
                onPriceChange={this.handlePriceChange}
                onCityChange={this.handleCityChange}
                onDescriptionChange={this.handleDescriptionChange}
            />
        );
    }
}

export default (props) => {
    return (
        <AuthContext.Consumer>
            {value => <EditAdvert auth={value} {...props} />}
        </AuthContext.Consumer>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        marginLeft: 8
    }
});
