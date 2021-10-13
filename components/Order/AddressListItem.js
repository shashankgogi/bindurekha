import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";

import CardView from "../../components/UI/Card";
import Colors from "../../constants/Colors";

const AddressItem = (props) => {
  const addressComp = (
    <CardView
      style={{
        overflow: "hidden",
        borderColor:
          props.selectedId == props.id
            ? Colors.primary_color
            : Colors.tertiary_Color,
        borderWidth: 0.5,
        height: "100%",
      }}
    >
      <View style={styles.nameView}>
        <Text
          numberOfLines={1}
          style={styles.name}
          adjustsFontSizeToFit={true}
          maxFontSizeMultiplier={1}
        >
          {props.name}
        </Text>
        <TouchableOpacity
          style={styles.deleteView}
          onPress={props.onDeleteClick.bind(this, props.id)}
        >
          <Text style={styles.delete}>X</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.address}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        {props.address}
      </Text>
      <Text
        style={styles.contactNo}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={1}
      >
        Contact No.: {props.contactNo}
      </Text>
      <View style={styles.buttonView}>
        <Button
          title="Edit"
          color="#fa6950"
          onPress={props.onEditClick.bind(this, props.id)}
        />
      </View>
    </CardView>
  );

  const addAddressComp = (
    <CardView
      style={{
        overflow: "hidden",
        borderColor: Colors.textColor,
        borderWidth: 0.3,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image style={styles.addImage} source={require("../../assets/add.png")} />
      <Text style={styles.addText}>Add New Address</Text>
    </CardView>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ ...styles.card, width: 350 }}
      onPress={() => {
        props.onItemClick(props.id);
      }}
    >
      {props.id == 0 ? addAddressComp : addressComp}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 180,
    margin: 8,
  },

  name: {
    fontSize: 18,
    marginHorizontal: 15,
    marginTop: 5,
    textAlign: "left",
    fontFamily: "appfont-l",
  },

  deleteView: {
    alignSelf: "center",
    marginTop: 10,
  },
  delete: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "appfont-m",
    alignSelf: "center",
  },

  nameView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    margin: 2,
    alignContent: "center",
    marginTop: 5,
  },

  address: {
    fontSize: 16,
    marginHorizontal: 15,
    marginRight: 30,
    textAlign: "left",
    fontFamily: "appfont-m",
    color: Colors.tertiary_Color,
  },
  contactNo: {
    fontSize: 16,
    marginHorizontal: 15,
    marginTop: 4,
    textAlign: "left",
    fontFamily: "appfont-m",
    color: Colors.tertiary_Color,
  },

  buttonView: {
    borderColor: Colors.primary_color,
    borderWidth: 0.5,
    width: "25%",
    borderRadius: 5,
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 10,
  },

  addImage: {
    height: 50,
    width: 50,
  },
  addText: {
    fontFamily: "appfont-l",
    fontSize: 16,
    color: Colors.textColor,
    marginTop: 15,
  },
});

export default AddressItem;
