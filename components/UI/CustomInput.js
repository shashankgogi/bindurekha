import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";

const { height, width } = Dimensions.get("window");
const INPUT_HEIGHT = 50; //height * 0.07;
const FONT_SIZE = 17;
const PADDING = 15;
const BORDER_WIDTH = 1;
const BG_COLOR = "#fff";
const COLOR_UNFOCUSED = "#c5b4b8";
const COLOR_FOCUSED = "blue";
const DURATION = 350;

export default class InputOutline extends React.Component {
  state = {
    currColor: COLOR_UNFOCUSED,
    labelWidth: null,
    focused: false,
  };
  labelRef = null;
  spacerRef = null;
  inputRef = null;

  handleFocus() {
    // console.log(this.props);
    this.setState({ currColor: this.props.focusedColor, focused: true });
    this.labelRef.transitionTo(
      {
        transform: [{ translateY: -(INPUT_HEIGHT / 2) }, { scale: 0.8 }],
      },
      DURATION
    );
    this.spacerRef.transitionTo({ transform: [{ scaleX: 1 }] }, DURATION);
  }

  async handleUnFocus() {
    // console.log(this.props.value.length);

    if (!this.props.value || this.props.value.length == 0) {
      setTimeout(() => this.setState({ focused: false }), DURATION);
      this.setState({ currColor: this.props.defaultColor });
      this.labelRef.transitionTo(
        {
          transform: [{ translateY: 0 }, { translateX: 0 }, { scale: 1 }],
        },
        DURATION
      );
      this.spacerRef.transitionTo({ transform: [{ scaleX: 0 }] }, DURATION);
    }
    this.props.onSubmitEditing();
  }

  componentDidMount() {
    if (this.props.value && this.props.value.length !== 0) {
      this.handleFocus();
    }
  }

  render() {
    const { style, placeholder } = this.props;
    const { currColor, labelWidth, labelHeight, focused } = this.state;

    let textComponent = (
      <TextInput
        {...this.props}
        style={{ ...styles.inputContainer, color: currColor }}
        ref={(ref) => (this.inputRef = ref)}
        onFocus={this.handleFocus.bind(this)}
        onBlur={this.handleUnFocus.bind(this)}
        placeholder={placeholder}
        placeholderTextColor={BG_COLOR}
        onChangeText={this.props.onChangeText}
        maxFontSizeMultiplier={1}
      />
    );
    if (this.props.password) {
      textComponent = (
        <View style={styles.passwordView}>
          <TextInput
            {...this.props}
            style={{ ...styles.inputContainer, color: currColor }}
            ref={(ref) => (this.inputRef = ref)}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleUnFocus.bind(this)}
            placeholder={placeholder}
            placeholderTextColor={BG_COLOR}
            onChangeText={this.props.onChangeText}
            maxFontSizeMultiplier={1}
          />
          <TouchableOpacity
            style={styles.skipView}
            onPress={this.props.onEyeClick}
          >
            <Image
              style={styles.eyeIcon}
              source={
                this.props.secureTextEntry
                  ? require("../../assets/eyehidden.png")
                  : require("../../assets/eyevisible.png")
              }
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View
        style={{
          ...styles.container,
          ...style,
          borderColor: currColor,
          marginTop: labelHeight,
        }}
      >
        {textComponent}
        <Animatable.View
          style={{
            position: "absolute",
            top: -BORDER_WIDTH,
            width: labelWidth,
            left: PADDING,
            backgroundColor: focused ? BG_COLOR : currColor,
            height: BORDER_WIDTH,
            transform: [{ scaleX: 0 }],
          }}
          ref={(ref) => (this.spacerRef = ref)}
          useNativeDriver
        />
        <Animatable.View
          ref={(ref) => (this.labelRef = ref)}
          useNativeDriver
          style={{ ...styles.labelStyle }}
          onLayout={(e) =>
            this.setState({
              labelWidth: e.nativeEvent.layout.width,
              labelHeight: e.nativeEvent.layout.height,
            })
          }
        >
          <Animatable.Text
            style={{ fontSize: FONT_SIZE, color: currColor }}
            onPress={() => this.inputRef.focus()}
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={1}
          >
            {placeholder}
          </Animatable.Text>
        </Animatable.View>
      </View>
    );
  }
}

InputOutline.propTypes = {
  focusedColor: PropTypes.string,
  defaultColor: PropTypes.string,
  placeholder: PropTypes.string,
};

InputOutline.defaultProps = {
  focusedColor: COLOR_FOCUSED,
  defaultColor: COLOR_UNFOCUSED,
  placeholder: "Placeholder",
};

const styles = StyleSheet.create({
  container: {
    height: INPUT_HEIGHT,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: BG_COLOR,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: PADDING,
    fontSize: FONT_SIZE,
  },
  labelStyle: {
    position: "absolute",
    top: INPUT_HEIGHT / 2 - FONT_SIZE / 2 - BORDER_WIDTH * 4,
    left: PADDING,
  },
  eyeIcon: {
    margin: 10,
    height: 30,
    width: 30,
  },
  passwordView: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
