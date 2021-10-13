import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Colors from "../../constants/Colors";

const IOSSearchBar = (props) => {
  const [searchText, setSearchText] = useState("");
  let searchInput = null;
  const { textChangeHandler } = props;
  useEffect(() => {
    if (searchInput) {
      searchInput.focus();
    }
    textChangeHandler(searchText);
  }, [searchText]);

  return (
    <View style={styles.searchView}>
      <TouchableOpacity activeOpacity={0.7} onPress={props.onBackClick}>
        <Image
          source={require("../../assets/back.png")}
          style={styles.searchImg}
        />
      </TouchableOpacity>
      <TextInput
        maxFontSizeMultiplier={1}
        placeholder="Search Products"
        onChangeText={(value) => setSearchText(value)}
        selectionColor={Colors.tertiary_Color}
        value={searchText}
        style={styles.input}
        blurOnSubmit
        onSubmitEditing={() => {
          console.log("end");
        }}
        returnKeyType="search"
        ref={(input) => {
          searchInput = input;
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "white",
    height: 50,
  },

  searchImg: {
    height: 20,
    width: 20,
    marginHorizontal: 15,
  },
  input: {
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    width: "80%",
    height: "100%",
    fontSize: 17,
    marginLeft: 10,
    fontFamily: "appfont-r",
  },
});
export default IOSSearchBar;
