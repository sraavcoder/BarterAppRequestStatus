import MyHeader from '../components/MyHeader'
import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';

import db from '../config';
import firebase from 'firebase';

export default class ItemRequest extends React.Component {

  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      itemType: '',
      itemDetails: '',
      reasonToRequest: '',
      isExchangeRequestActive: false,
      requestID: '',
      requestedItemName: '',
      docid: '',
      itemStatus: '',
    }
  }

  createUniqueID = () => {
    return Math.random().toString(36).substring(7);
  }

  addRequest = (itemType, reasonToRequest, details) => {

    if (this.state.itemType !== '' && this.state.reasonToRequest !== '' && this.state.itemDetails !== '') {
      var userID = this.state.userID;
      var randomRequestID = this.createUniqueID();

      db.collection("requestedItems").add({
        "userID": userID,
        "ItemType": itemType,
        "ReasonToRequest": reasonToRequest,
        "ItemDetails": details,
        "RequestID": randomRequestID,
        "itemStatus": 'requested',
      })
      this.setState({
        itemType: '',
        reasonToRequest: '',
        itemDetails: '',
      })

      db.collection('user').where('User_Name', '==', this.state.userID)
        .onSnapshot(data => {
          data.forEach(doc => {
            db.collection('user').doc(doc.id).update({
              'IsExchangeRequestActive': true
            })
          })
        })



      return alert("Item Requested Successfully");
    } else {
      alert("Please fill the details properly")
    }

  }



  getIsExchangeRequestActive = () => {
    db.collection('user').where('User_Name', '==', this.state.userID)
      .onSnapshot(data => {
        data.forEach(doc => {
          this.setState({
            isExchangeRequestActive: doc.data().IsExchangeRequestActive,
          })
        })
      })
  }

  sendNotification = () => {
    db.collection("user").where("User_Name", "==", this.state.userID).get()
      .then(
        snapshot => {
          snapshot.forEach(doc => {
            var firstName = doc.data().First_Name;
            var lastName = doc.data().Last_Name;
            db.collection("AllNotification").where("requestID", '==', this.state.requestID).get()
              .then(
                snapshot => {
                  snapshot.forEach(doc => {
                    var itemName = doc.data().itemName;
                    var donarID = doc.data().DonarID;

                    db.collection("AlNotifications").add({
                      "targetedUserID": donarID,
                      "message": firstName + " " + lastName + ' Recieves the item ' + itemName,
                      "NotificationStatus": 'unread',
                      "itemName": itemName,
                    })
                  })
                }
              )
          }
          )
        }
      )
  }

  updateItemRequest = () => {
    db.collection("requestedItems").doc(this.state.docid).update({
      'itemStatus': 'recieved',
    })
    db.collection('user').where("User_Name", "==", this.state.userID)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('user').doc(doc.id).update({ IsExchangeRequestActive: false })
        })
      })
  }

  recievedItem = (itemName) => {
    var userID = this.state.userID;
    var requestID = this.state.requestID;

    db.collection("RecievedItems").add({
      "userID": userID,
      "requestID": requestID,
      "itemName": itemName,
      "itemStatus": 'recieved',
    })

  }

  getItemRequest = async () => {
    db.collection("requestedItems").where("userID", '==', this.state.userID)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            requestID: doc.data().RequestID,
            requestedItemName: doc.data().ItemType,
            docid: doc.id,
            itemStatus: doc.data().itemStatus,
          })
        })
      })
  }



  componentDidMount() {
    this.getIsExchangeRequestActive();
    this.getItemRequest();
  }

  render() {
    if (this.state.isExchangeRequestActive == true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }} >
          <View style={{ borderColor: 'orange', borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 7 }} >
            <Text>Item Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View style={{ borderColor: 'orange', borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 7 }} >
            <Text>Book Status</Text>
            <Text>{this.state.itemStatus}</Text>
          </View>
          <TouchableOpacity style={{ borderWidth: 1, borderColor: 'orange', backgroundColor: 'orange', width: 300, alignSelf: 'center' }}
            onPress={
              () => {
                this.sendNotification();
                this.updateItemRequest();
                this.recievedItem(this.state.requestedItemName);
              }
            }
          >
            <Text>I Recieved The Item</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }} >
          <MyHeader title="Request Items" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyBoardStyle} >

            <TextInput
              placeholder={"Enter Item Type"}
              onChangeText={(e) => { this.setState({ itemType: e }) }}
              value={this.state.itemType.toLocaleLowerCase()}
              style={styles.formTextInput}
            />
            <TextInput
              placeholder={"Why do you need that Item"}
              multiline
              numberOfLines={5}
              onChangeText={(e) => { this.setState({ reasonToRequest: e }) }}
              value={this.state.reasonToRequest}
              style={[styles.formTextInput, { height: 100 }]}
            />

            <TextInput
              placeholder={"Details of the item you want"}
              multiline
              numberOfLines={5}
              onChangeText={(e) => { this.setState({ itemDetails: e }) }}
              value={this.state.itemDetails}
              style={[styles.formTextInput, { height: 150 }]}
            />

            <TouchableOpacity onPress={() => {
              this.addRequest(this.state.itemType, this.state.reasonToRequest, this.state.itemDetails)
            }} style={styles.button}  >
              <Text style={{ color: 'white', fontSize: 20 }} >Request</Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: "#00adb5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
    textAlign: "center",
    marginBottom: 50,
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: 'center',
    borderColor: '#00adb5',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
})

