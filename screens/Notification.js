import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

import SwipableFlatList from '../components/SwipableFlatList';


export default class NotificationScreen extends Component {
    constructor() {
        super();
        this.state = {
            allNotifications: [],
            userID: firebase.auth().currentUser.email,
            message: '',
            itemName: '',
        }
        this.requestRef = null
    }

    getNotifications = () => {
        db.collection("AllNotification").where("NotificationStatus", "==", "Unread").where("UserID", "==", this.state.userID).get()
            .then(
                snapshot => {
                    snapshot.forEach((doc) => {
                        var a = doc.data().message;
                        var b = doc.data().itemName;
                        var allNotifications = []
                        allNotifications.push({ "itemName": a, "message": b });
                        this.setState({
                            allNotifications: allNotifications,
                            message: allNotifications[0],
                            itemName: allNotifications[1]
                        })
                    })
                }
            )
    }



    componentDidMount() {
        this.getNotifications();
    }

    keyExtractor = (item, index) => index.toString()

    render() {

        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="Your Notifications" navigation={this.props.navigation} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.allNotifications.length === 0
                            ? (
                                <View style={styles.subContainer}>
                                    <Text style={{ fontSize: 20 }}>You Have No Notifications</Text>
                                </View>
                            )
                            : (
                                <SwipableFlatList allNotifications={this.state.allNotifications} />
                            )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
