import React from 'react';

import { Dimensions, View, Text, StyleSheet } from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

import { SwipeListView } from 'react-native-swipe-list-view';

import db from '../config';


export default class SwipableFlatList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allNotifications: this.props.allNotifications,
        }
    }

    renderItem = (item) => {
        return (
            <View style={{ marginLeft: 10 }} >
                <Text style={{ paddingTop: 10, fontSize: 15, paddingBottom: 3 }}>{<b>{item.item.message}</b>}</Text>
                <Text style={{ paddingBottom: 3, fontSize: 15 }}>{item.item.itemName}</Text>
            </View>
        )
    }

    renderHiddenItem = () => {
        <View style={styles.rowBack} >
            <View style={[styles.backRightBtm, styles.backRightBtmRight]} >
                <Text styles={styles.backTextWhite} ></Text>
            </View>
        </View>
    }

    updateMarkAsRead = (notification) => {
        db.collection("AllNotification").doc(notification.doc_id).update({
            "NotificationStatus": 'read',
        })
    }

    onSwipeValueChange = (swipeData) => {
        var allNotifications = this.state.allNotifications;
        const { key, value } = swipeData;
        if (value < -Dimensions.get("window").width) {
            const newData = [...allNotifications];
            const previousIndex = allNotifications.findIndex(item => {
                item.key == key;
            });
            this.updateMarkAsRead(allNotifications[previousIndex]);
            newData.splice(previousIndex, 1);
            this.setState({
                allNotifications: newData,
            })
        }
    }

    render() {
        console.log(this.state.docID)
        return (
            <View style={styles.container}>
                <SwipeListView
                    disableRightSwipe
                    data={this.state.allNotifications}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    rightOpenValue={-Dimensions.get('window').width}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onSwipeValueChange={this.onSwipeValueChange}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#29b6f6',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backRightBtnRight: {
        backgroundColor: '#29b6f6',
        right: 0,
    },
});

