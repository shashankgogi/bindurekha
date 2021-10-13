import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, Platform, FlatList, Alert } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import IOSSearchBar from "../components/UI/iOSSearchBar";
import * as productAction from "../store/action/product/Product";
import Loader from "../components/UI/CustomLoader";
import ProductItem from "../components/product/ProductListItem";
import EmptyView from "../components/UI/EmptyScreen";

const EmptyViewComponent = (
  <EmptyView
    title="Oops! No results found"
    subTitle="Please try again later or try something else"
    image={require("../assets/emptysearch.png")}
  />
);

const SearchProduct = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const products = useSelector((state) => state.products.searchProducts);
  const emptyList = useSelector((state) => state.products.emptyList);
  let dispatch = useDispatch();

  const fetchSearchProducts = useCallback(async (text) => {
    if (text.length === 0) {
      dispatch(productAction.resetProductList());
      return;
    }

    if (text.length > 3 || products.length != 0) {
      try {
        setIsLoading(true);
        setError(null);
        dispatch(productAction.resetProductList());
        await dispatch(productAction.fetchProductsAction(0, 0, 0, text));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err);
      }
    }
  });

  useEffect(() => {
    if (error) {
      Alert.alert("", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <IOSSearchBar
        onBackClick={() => {
          props.navigation.goBack();
        }}
        textChangeHandler={fetchSearchProducts}
      />
      {isLoading && <Loader />}
      {emptyList == true ? (
        EmptyViewComponent
      ) : (
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={products}
          renderItem={(itemData) => (
            <ProductItem
              imageUrl={itemData.item.imageUrl}
              title={itemData.item.name}
              list={true}
              price={itemData.item.discountedPrice}
              onItemClick={() => {
                props.navigation.navigate("Details", {
                  product: itemData.item,
                });
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

export default SearchProduct;
