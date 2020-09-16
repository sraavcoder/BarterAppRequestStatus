import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class myBarters extends Component {
    constructor() {
        super()
        this.state = {
            AllDonations: [],
            userID: firebase.auth().currentUser.email,
            donarName: '',
        }
        this.requestRef = null
    }

    getAllDonations = () => {
        this.requestRef = db.collection("AllBarters").where("DonarID", '==', this.state.userID)
            .onSnapshot((snapshot) => {
                var AllDonations = snapshot.docs.map(document => document.data());
                this.setState({
                    AllDonations: AllDonations
                });
            })
    }

    sendNotification = (bookDetails, status) => {
        var requestID = bookDetails.requestID;
        var donarID = bookDetails.donarID;
        db.collection("AllNotification").where("requestID", "==", requestID).where("DonarID", "==", donarID).get()
            .then(
                snapshot => {
                    snapshot.forEach((doc) => {
                        var message = "";
                        if (status = "itemSent") {
                            message = this.state.donarName + " Has Sent You A Book";
                        } else {
                            message = this.state.donarName + " Has Shown Intrest In Donationg The Book";
                        }
                        db.collection("AllNotification").doc(doc.id).update({
                            "message": message,
                            "NotificationStatus": "Unread",
                            "date": firebase.firestore.FieldValue.serverTimestamp(),
                        })
                    }
                    )
                }
            )
    }

    sendBook = (item) => {
        if (item.RequestStatus == 'itemSent') {
            var requestStatus = "Donar Intrested";
            db.collection("AllDonations").doc(item.doc_id).update({
                RequestStatus: requestStatus,
            })
            this.sendNotificatoin(item, requestStatus);
        } else {
            var requestStatus = "itemSent";
            db.collection("AllDonations").doc(item.doc_id).update({
                RequestStatus: requestStatus,
            })
            this.sendNotification(item, requestStatus);
        }
    }

    componentDidMount() {
        this.getAllDonations();
    }

    componentWillUnmount() {
        this.requestRef();
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={item.itemName}
                subtitle={"Requested By :" + item.RequestedBy + "Status :" + item.RequestStatus}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                rightElement={
                    <TouchableOpacity style={[styles.button, { backgroundColor: item.RequestStatus == "itemSent" ? "green" : '#ff5722' }]}
                        onPress={() => {
                            this.sendBook(item);
                        }}  >
                        <Text style={{ color: '#ffff' }}>{item.RequestStatus == "itemSent" ? "Exchanged" : 'Exchange'}</Text>
                    </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="My Donations" navigation={this.props.navigation} />
                <View style={{ flex: 1 }}>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.AllDonations}

                        renderItem={({ item }) => (
                            <View style={{ borderBottomWidth: 2, borderColor: '#a5a5a5', }}>
                                <View style={{ marginLeft: 10 }} >
                                    <Text style={{ paddingTop: 10, fontSize: 15, paddingBottom: 3 }}>{<b>{item.itemName.toUpperCase()}</b>}</Text>
                                    <Text style={{ paddingBottom: 3, fontSize: 15 }}>{"Requested By " + item.RequestedBy + ' ,'}</Text>
                                    <Text style={{ paddingBottom: 3, fontSize: 15 }}>{"Status = " + item.RequestStatus}</Text>
                                </View>
                                <TouchableOpacity style={[styles.button, { backgroundColor: item.RequestStatus == "itemSent" ? "green" : '#ff5722' }]}  >
                                    <Text style={{ color: '#ffff' }}>Exchange</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />


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
    button: {
        width: 200,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16,
        borderRadius: 10,
        marginBottom: 10,
    }
})

