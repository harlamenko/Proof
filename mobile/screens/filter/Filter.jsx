import React, { useState, useContext } from 'react';
import { AdvertsContext, AdvertsProvider } from '../../context';
import { SearchBar, CheckBox, Button } from 'react-native-elements';

export default ({ navigation }) => {
  const {
    state: { search },
    updateFilter,
  } = useContext(AdvertsContext);

  const [field, setField] = useState(search.field);
  const [keyWords, setKeyWords] = useState(search.keyWords);
  const [direct, setDirect] = useState(search.direct);

  const asc = +1;
  const desc = -1;
  const date = 'publication_date';
  const price = 'price';

  const newbie = field === date && direct === desc;
  const old = field === date && direct === asc;
  const expensive = field === price && direct === desc;
  const cheap = field === price && direct === asc;

  const changeGlobalFilter = () => {
    const newSearch = { field, keyWords, direct };

    updateFilter({ search: newSearch });
    navigation.navigate('Adverts');
  };

  return (
    <>
      <SearchBar
        autoFocus={true}
        platform="ios"
        containerStyle={{ marginBottom: 14 }}
        value={keyWords}
        onChangeText={setKeyWords}
      />
      <CheckBox
        title="Сначала новые"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={newbie}
        onPress={() => {
          setField(date);
          setDirect(desc);
        }}
      />
      <CheckBox
        title="Сначала старые"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={old}
        onPress={() => {
          setField(date);
          setDirect(asc);
        }}
      />
      <CheckBox
        title="Сначала дорогие"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={expensive}
        onPress={() => {
          setField(price);
          setDirect(desc);
        }}
      />
      <CheckBox
        title="Сначала дешевые"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={cheap}
        onPress={() => {
          setField(price);
          setDirect(asc);
        }}
      />
      <Button
        title="Найти"
        containerStyle={{
          marginTop: 14,
          marginHorizontal: 10,
        }}
        onPress={() => {
          changeGlobalFilter();
        }}
      />
    </>
  );
};

// export default (props) => (
//   <AdvertsProvider>
//     <Filter {...props} />
//   </AdvertsProvider>
// );
