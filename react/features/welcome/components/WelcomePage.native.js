import React from "react";
import {
    Animated,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
    NativeModules,
} from "react-native";
import _ from "lodash";
import { getName } from "../../app/functions";
import { ColorSchemeRegistry } from "../../base/color-scheme";
import { translate } from "../../base/i18n";
import {
    Icon,
    IconMenu,
    IconWarning,
    IconSwitchCamera,
    IconDeviceSpeaker,
    IconArrowDown,
} from "../../base/icons";
import {
    MEDIA_TYPE,
    toggleCameraFacingMode,
    VideoTrack,
} from "../../base/media";
import { openDialog } from "../../base/dialog";
import AudioRoutePickerDialog, {
    deviceInfoMap,
} from "../../mobile/audio-mode/components/AudioRoutePickerDialog";
import { Header, LoadingIndicator, Text } from "../../base/react";
import { connect } from "../../base/redux";
import { ColorPalette } from "../../base/styles";
import {
    createDesiredLocalTracks,
    destroyLocalTracks,
    getLocalVideoTrack,
} from "../../base/tracks";
import { HelpView } from "../../help";
import { DialInSummary } from "../../invite";
import { SettingsView } from "../../settings";
import { setSideBarVisible } from "../actions";

import {
    AbstractWelcomePage,
    _mapStateToProps as _abstractMapStateToProps,
} from "./AbstractWelcomePage";
import LocalVideoTrackUnderlay from "./LocalVideoTrackUnderlay";
import VideoSwitch from "./VideoSwitch";
import WelcomePageLists from "./WelcomePageLists";
import WelcomePageSideBar from "./WelcomePageSideBar";
import styles, { PLACEHOLDER_TEXT_COLOR } from "./styles";

const { AudioMode } = NativeModules;

/**
 * The native container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Constructor of the Component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state._fieldFocused = false;
        this.state.hintBoxAnimation = new Animated.Value(0);

        // Bind event handlers so they are only bound once per instance.
        this._onFieldFocusChange = this._onFieldFocusChange.bind(this);
        this._onShowSideBar = this._onShowSideBar.bind(this);
        this._renderHintBox = this._renderHintBox.bind(this);

        // Specially bind functions to avoid function definition on render.
        this._onFieldBlur = this._onFieldFocusChange.bind(this, false);
        this._onFieldFocus = this._onFieldFocusChange.bind(this, true);
        this.getSelectedDevice = this.getSelectedDevice.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        this._updateRoomname();

        const { dispatch } = this.props;

        AudioMode.setMode(AudioMode.VIDEO_CALL).catch((err) =>
            logger.error(`Failed to set audio mode ${String(mode)}: ${err}`)
        );
        AudioMode.updateDeviceList && AudioMode.updateDeviceList();

        if (this.props._settings.startAudioOnly) {
            dispatch(destroyLocalTracks());
        } else {
            // Make sure we don't request the permission for the camera from
            // the start. We will, however, create a video track iff the user
            // already granted the permission.
            navigator.permissions.query({ name: "camera" }).then((response) => {
                response === "granted" &&
                    dispatch(createDesiredLocalTracks(MEDIA_TYPE.VIDEO));
            });
        }
    }

    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // We want to have the welcome page support the reduced UI layout,
        // but we ran into serious issues enabling it so we disable it
        // until we have a proper fix in place. We leave the code here though, because
        // this part should be fine when the bug is fixed.
        //
        // NOTE: when re-enabling, don't forget to uncomment the respective _mapStateToProps line too

        /*
        const { _reducedUI } = this.props;

        if (_reducedUI) {
            return this._renderReducedUI();
        }
        */
        const { t } = this.props;
        const selectedDevice = this.getSelectedDevice(this.props);

        return (
            <View style={{ backgroundColor: "white", padding: 20 }}>
                <View
                    style={{
                        width: "100%",
                        height: 300,
                        borderRadius: 15,
                        overflow: "hidden",
                    }}
                >
                    <VideoTrack videoTrack={this.props._localVideoTrack} />
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(toggleCameraFacingMode());
                        }}
                        style={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            backgroundColor: "#00000090",
                            borderRadius: 8,
                            padding: 7,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon
                            src={IconSwitchCamera}
                            size={25}
                            style={{ color: "white" }}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 15,
                        marginBottom: 5,
                        alignItems: "center",
                    }}
                >
                    <Icon
                        src={IconDeviceSpeaker}
                        size={20}
                        style={{ color: "#1C8FD8", marginRight: 5 }}
                    />
                    <Text>SPEAKERS</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(openDialog(AudioRoutePickerDialog));
                    }}
                    style={{
                        width: "100%",
                        height: 50,
                        backgroundColor: "#F4F5FA",
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 15,
                    }}
                >
                    <Text style={{ flex: 1 }}>{selectedDevice?.text}</Text>
                    <Icon src={IconArrowDown} size={16} color="#923BBA" />
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInsecureRoomNameWarning() {
        return (
            <View
                style={[
                    styles.messageContainer,
                    styles.insecureRoomNameWarningContainer,
                ]}
            >
                <Icon
                    src={IconWarning}
                    style={styles.insecureRoomNameWarningIcon}
                />
                <Text style={styles.insecureRoomNameWarningText}>
                    {this.props.t("security.insecureRoomNameWarning")}
                </Text>
            </View>
        );
    }

    /**
     * Constructs a style array to handle the hint box animation.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getHintBoxStyle() {
        return [
            styles.messageContainer,
            styles.hintContainer,
            {
                opacity: this.state.hintBoxAnimation,
            },
        ];
    }

    /**
     * Callback for when the room field's focus changes so the hint box
     * must be rendered or removed.
     *
     * @private
     * @param {boolean} focused - The focused state of the field.
     * @returns {void}
     */
    _onFieldFocusChange(focused) {
        focused &&
            this.setState({
                _fieldFocused: true,
            });

        Animated.timing(this.state.hintBoxAnimation, {
            duration: 300,
            toValue: focused ? 1 : 0,
        }).start(
            (animationState) =>
                animationState.finished &&
                !focused &&
                this.setState({
                    _fieldFocused: false,
                })
        );
    }

    getSelectedDevice(props) {
        const { _devices: devices } = props;
        // console.log("DEVICES", devices);
        if (!devices) {
            return null;
        }

        const audioDevices = [];

        for (const device of devices) {
            const infoMap = deviceInfoMap[device.type];
            const text =
                device.type === "BLUETOOTH" && device.name
                    ? device.name
                    : infoMap.text;

            if (infoMap) {
                const info = {
                    ...infoMap,
                    selected: Boolean(device.selected),
                    text: props.t(text),
                    uid: device.uid,
                };

                audioDevices.push(info);
            }
        }

        // console.log("AUDIO_DEVICES", audioDevices);

        return _.find(audioDevices, (device) => device.selected);
    }

    /**
     * Toggles the side bar.
     *
     * @private
     * @returns {void}
     */
    _onShowSideBar() {
        Keyboard.dismiss();
        this.props.dispatch(setSideBarVisible(true));
    }

    /**
     * Renders the hint box if necessary.
     *
     * @private
     * @returns {React$Node}
     */
    _renderHintBox() {
        if (this.state._fieldFocused) {
            const { t } = this.props;

            return (
                <Animated.View style={this._getHintBoxStyle()}>
                    <View style={styles.hintTextContainer}>
                        <Text style={styles.hintText}>
                            {t("welcomepage.roomnameHint")}
                        </Text>
                    </View>
                    <View style={styles.hintButtonContainer}>
                        {this._renderJoinButton()}
                    </View>
                </Animated.View>
            );
        }

        return null;
    }

    /**
     * Renders the join button.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderJoinButton() {
        const { t } = this.props;
        let children;

        if (this.state.joining) {
            // TouchableHighlight is picky about what its children can be, so
            // wrap it in a native component, i.e. View to avoid having to
            // modify non-native children.
            children = (
                <View>
                    <LoadingIndicator
                        color={styles.buttonText.color}
                        size="small"
                    />
                </View>
            );
        } else {
            children = (
                <Text style={styles.buttonText}>
                    {this.props.t("welcomepage.join")}
                </Text>
            );
        }

        return (
            <TouchableHighlight
                accessibilityLabel={t("welcomepage.accessibilityLabel.join")}
                onPress={this._onJoin}
                style={styles.button}
                underlayColor={ColorPalette.white}
            >
                {children}
            </TouchableHighlight>
        );
    }

    /**
     * Renders the full welcome page.
     *
     * @returns {ReactElement}
     */
    _renderFullUI() {
        const roomnameAccLabel = "welcomepage.accessibilityLabel.roomname";
        const { _headerStyles, t } = this.props;

        return (
            <LocalVideoTrackUnderlay style={styles.welcomePage}>
                <View style={_headerStyles.page}>
                    <Header style={styles.header}>
                        <TouchableOpacity onPress={this._onShowSideBar}>
                            <Icon
                                src={IconMenu}
                                style={_headerStyles.headerButtonIcon}
                            />
                        </TouchableOpacity>
                        <VideoSwitch />
                    </Header>
                    <SafeAreaView style={styles.roomContainer}>
                        <View style={styles.joinControls}>
                            <Text style={styles.enterRoomText}>
                                {t("welcomepage.roomname")}
                            </Text>
                            <TextInput
                                accessibilityLabel={t(roomnameAccLabel)}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                autoFocus={false}
                                onBlur={this._onFieldBlur}
                                onChangeText={this._onRoomChange}
                                onFocus={this._onFieldFocus}
                                onSubmitEditing={this._onJoin}
                                placeholder={this.state.roomPlaceholder}
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                returnKeyType={"go"}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                value={this.state.room}
                            />
                            {this._renderInsecureRoomNameWarning()}
                            {this._renderHintBox()}
                        </View>
                    </SafeAreaView>
                    <TouchableOpacity
                        style={{
                            width: 50,
                            height: 50,
                            backgroundColor: "red",
                        }}
                        onPress={() => {
                            this.props.dispatch(toggleCameraFacingMode());
                        }}
                    />
                    <WelcomePageLists disabled={this.state._fieldFocused} />
                </View>
                <WelcomePageSideBar />
                {this._renderWelcomePageModals()}
            </LocalVideoTrackUnderlay>
        );
    }

    /**
     * Renders a "reduced" version of the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderReducedUI() {
        const { t } = this.props;

        return (
            <View style={styles.reducedUIContainer}>
                <Text style={styles.reducedUIText}>
                    {t("welcomepage.reducedUIText", { app: getName() })}
                </Text>
            </View>
        );
    }

    /**
     * Renders JitsiModals that are supposed to be on the welcome page.
     *
     * @returns {Array<ReactElement>}
     */
    _renderWelcomePageModals() {
        return [
            <HelpView key="helpView" />,
            <DialInSummary key="dialInSummary" />,
            <SettingsView key="settings" />,
        ];
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        ..._abstractMapStateToProps(state),
        _headerStyles: ColorSchemeRegistry.get(state, "Header"),
        _localVideoTrack: getLocalVideoTrack(state["features/base/tracks"]),
        _devices: state["features/mobile/audio-mode"].devices,
        // _reducedUI: state['features/base/responsive-ui'].reducedUI
    };
}

export default translate(connect(_mapStateToProps)(WelcomePage));
