import React, { Component } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailId: '',
            firstName: '',
            lastName: '',
            address: '',
            contact: '',
            docId: ''
        }
    }

    getUserDetails = () => {
        var email = firebase.auth().currentUser.email;
        db.collection('user').where('User_Name', '==', email).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var data = doc.data()
                    this.setState({
                        emailId: data.User_Name,
                        firstName: data.First_Name,
                        lastName: data.Last_Name,
                        address: data.Adress,
                        contact: data.Contact,
                        docId: doc.id
                    })

                });
            })
    }

    updateUserDetails = () => {
        db.collection('user').doc(this.state.docId)
            .update({
                "First_Name": this.state.firstName,
                "Last_Name": this.state.lastName,
                "Adress": this.state.address,
                "Contact": this.state.contact,
            })

        alert("Profile Updated Successfully")

    }

    componentDidMount() {
        this.getUserDetails()
    }


    render() {

        return (
            <View>
                <MyHeader title="Settings" navigation={this.props.navigation} />
                <View style={styles.container} >

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.formTextInput}
                            placeholder={"First Name"}
                            maxLength={8}
                            onChangeText={(text) => {
                                this.setState({
                                    firstName: text
                                })
                            }}
                            value={this.state.firstName}
                        />
                        <TextInput
                            style={styles.formTextInput}
                            placeholder={"Last Name"}
                            maxLength={8}
                            onChangeText={(text) => {
                                this.setState({
                                    lastName: text
                                })
                            }}
                            value={this.state.lastName}
                        />
                        <TextInput
                            style={styles.formTextInput}
                            placeholder={"Contact"}
                            maxLength={10}
                            keyboardType={'numeric'}
                            onChangeText={(text) => {
                                this.setState({
                                    contact: text
                                })
                            }}
                            value={this.state.contact}
                        />
                        <TextInput
                            style={styles.formTextInput}
                            placeholder={"Address"}
                            onChangeText={(text) => {
                                this.setState({
                                    address: text
                                })
                            }}
                            value={this.state.address}
                        />
                        <TouchableOpacity style={styles.button}
                            onPress={() => {
                                this.updateUserDetails()
                            }}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    formTextInput: {
        width: "75%",
        height: 40,
        alignSelf: 'center',
        borderColor: '#ffba0c',
        borderRadius: 5,
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
    },
    button: {
        width: "75%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: "#ff9d00",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
    },
    buttonText: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#fff"
    }
})