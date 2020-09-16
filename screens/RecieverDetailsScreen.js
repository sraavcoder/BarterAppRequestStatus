import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from 'react-native-elements';

import firebase from 'firebase';
import db from '../config';

export default class RecieverDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            recieverID: this.props.navigation.getParam("details")["userID"],
            requestID: this.props.navigation.getParam("details")["RequestID"],
            itemName: this.props.navigation.getParam("details")["ItemType"],
            itemDetails: this.props.navigation.getParam("details")["ItemDetails"],
            reasonToRequest: this.props.navigation.getParam("details")["ReasonToRequest"],
            RecieverName: '',
            RecieverContact: '',
            RecieverAdress: '',
            RecieverRequestDocID: '',
            userName: '',
        }
    }

    getUserName = (userID) => {
        db.collection('user').where("User_Name", "==", userID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            userName: doc.data().First_Name + " " + doc.data().Last_Name,
                        })
                    }
                    )
                }
            )
    }

    getRicieverDetails() {
        db.collection("user").where("User_Name", "==", this.state.recieverID).get()
            .then(
                snapshot => {
                    snapshot.forEach((doc) => {
                        this.setState({
                            RecieverName: doc.data().First_Name,
                            RecieverAdress: doc.data().Adress,
                            RecieverContact: doc.data().Contact,
                        })
                    })
                }
            )

        db.collection("requestedItems").where("RequestID", "==", this.state.requestID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            RecieverRequestDocID: doc.id
                        })
                    }
                    )
                }
            )
    }

    componentDidMount() {
        this.getRicieverDetails();
        this.getUserName(this.state.userID);
    }

    updateStatus = () => {
        db.collection("AllBarters").add({
            itemName: this.state.itemName,
            itemDetails: this.state.itemDetails,
            requestID: this.state.requestID,
            RequestedBy: this.state.RecieverName,
            DonarID: this.state.userID,
            RequestStatus: 'Donar Intrested',
        })
    }

    addNotifications = () => {
        var message = this.state.userName + " Has Shown Intrest In Donating The Item";
        db.collection("AllNotification").add({
            "UserID": this.state.recieverID,
            "itemName": this.state.itemName,
            "requestID": this.state.requestID,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "message": message,
            "DonarID": this.state.userID,
            "NotificationStatus": 'Unread',
        })
    }

    render() {
        return (
            <View style={styles.container} >
                <View>
                    <Card
                        title={"ItemInformation"}
                        titleStyle={{ fontSize: 20, }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>itemName: {this.state.itemName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>itemDetails: {this.state.itemDetails}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>ReasonToRequest: {this.state.reasonToRequest}</Text>
                        </Card>
                    </Card>
                </View>
                <View>
                    <Card
                        title={"RecieverInformation"}
                        titleStyle={{ fontSize: 20, }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>RecieverName: {this.state.RecieverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>RecieverAdress: {this.state.RecieverAdress}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>RecieverContact: {this.state.RecieverContact}</Text>
                        </Card>
                    </Card>

                </View>
                <View style={styles.buttonContainer} >
                    {
                        this.state.recieverID !== this.state.userID ?
                            <TouchableOpacity onPress={() => {
                                this.addNotifications();
                                this.updateStatus();
                                this.props.navigation.navigate("MyBarters");
                            }} style={styles.button} >
                                <Text>Exchange</Text>
                            </TouchableOpacity>
                            : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    buttonContainer: { flex: 0.3, justifyContent: 'center', alignItems: 'center' },
    button: { width: 200, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'orange', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation: 16, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, }
})