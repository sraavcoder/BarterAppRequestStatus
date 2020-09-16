import React, { Component } from 'react';

import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';



export default class MyRecievedItemsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            itemName: '',
            itemStatus: '',
            requestID: '',
            allItems: []
        }
        this.requestRef = null
    }

    getRecievedItemsList = () => {
        db.collection("requestedItems")
            .where("userID", '==', this.state.userID)
            .where('itemStatus', '==', 'recieved')
            .get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    var a = doc.data().ItemType;
                    var b = doc.data().itemStatus;
                    var allItems = [];
                    allItems.push({ "itemName": a, "itemStatus": b });
                    this.setState({
                        allItems: allItems,
                        itemName: a,
                        itemStatus: b
                    })
                })

            })
    }

    componentDidMount() {
        this.getRecievedItemsList();
    }

    keyExtractor = (item, i) => i.toString()

    render() {
        console.log(this.state.allItems)
        return (
            <View style={{ flex: 1 }} >
                <MyHeader title="Recieved Items" navigation={this.props.navigation} />
                <View style={{ flex: 1 }} >
                    {this.state.allItems.map((item, index) => {
                        return (
                            <View style={{ borderBottomWidth: 2, borderColor: '#a5a5a5', }}>
                                <View style={{ marginLeft: 10 }} >
                                    <Text style={{ paddingTop: 10, fontSize: 15, paddingBottom: 3 }}>{<b>{item.itemName.toUpperCase()}</b>}</Text>
                                    <Text style={{ paddingBottom: 3, fontSize: 15 }}>{item.itemStatus}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
