import React from 'react';
import { StyleSheet, Text, View, ListItem, TouchableOpacity, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';

import MyHeader from '../components/MyHeader';

var use = false;

export default class ItemDonate extends React.Component {
  constructor() {
    super();
    this.state = {
      search: '',
      value: '',
      allTransactions: [],
      lastTransaction: null,
    }
  }

  fetchTransaction = async () => {
    if (use == true) {
      const query2 = await db.collection('requestedItems').startAfter(this.state.lastTransaction).limit(1).get();

      query2.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });

    }

  }

  retriveStory = async () => {
    this.setState({
      search: '',
    })
    use = true;

    this.setState({
      allTransactions: []
    })

    const query = await db.collection('requestedItems').limit(11).get();

    query.docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastTransaction: doc,
      });
    });

  };

  searchFilter = async (searchText) => {

    use = false;
    this.setState({
      allTransactions: [],
    })
    var enterText = searchText;
    if (enterText == searchText) {
      const transaction = await db.collection("requestedItems").where("ItemType", "==", searchText).get();
      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
        });

      });

    }
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <MyHeader title="Donate Items" navigation={this.props.navigation} />
        <SearchBar
          placeholder="Item you want to Exchange"
          onChangeText={(e) => this.setState({ search: e })}
          value={this.state.search}
          lightTheme
          inputStyle={{ color: '#444' }}
        />

        <TouchableOpacity style={{ backgroundColor: '#f47b9d', height: 25, borderRadius: 5, marginLeft: 5, marginRight: 5 }}
          onPress={() => { this.searchFilter(this.state.search) }}
        >
          <Text style={{ textAlign: 'center', color: 'white', paddingTop: 2 }}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: '#f47b9d', height: 25, borderRadius: 5, marginTop: 10, marginLeft: 5, marginRight: 5 }}
          onPress={() => { this.retriveStory() }}
        >
          <Text style={{ textAlign: 'center', color: 'white', paddingTop: 2 }}>Show All</Text>
        </TouchableOpacity>





        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item }) => (


            <View style={{ borderBottomWidth: 2, borderColor: '#a5a5a5', }}>

              <View style={{ marginLeft: 10 }} >
                <Text style={{ paddingTop: 10, fontSize: 15, paddingBottom: 3 }}>{<b>{item.ItemType}</b>}</Text>
                <Text style={{ paddingBottom: 3, fontSize: 15 }}>{item.ItemDetails}</Text>
              </View>
              <TouchableOpacity style={{ alignSelf: 'center', width: 200, backgroundColor: '#f47b9d', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, margin: 10, height: 25, borderRadius: 5 }}
                onPress={() => {
                  this.props.navigation.navigate('RecieverDetailsScreen', { "details": item })
                }}
              >
                <Text style={{ color: 'white', alignSelf: 'center' }} >Exchange</Text>
              </TouchableOpacity>

            </View>

          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchTransaction}
          onEndReachedThreshold={0.7}
        />

      </View>
    );
  }
}
