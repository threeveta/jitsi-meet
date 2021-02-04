import React from "react";
import {
    TouchableHighlight,
    TouchableOpacity,
    View,
    NativeModules,
    Platform,
} from "react-native";
import Collapsible from "react-native-collapsible";
import _ from "lodash";
import { translate } from "../../base/i18n";
import {
    Icon,
    IconSwitchCamera,
    IconDeviceSpeaker,
    IconArrowDown,
} from "../../base/icons";
import {
    MEDIA_TYPE,
    toggleCameraFacingMode,
    VideoTrack,
} from "../../base/media";
import { deviceInfoMap } from "../../mobile/audio-mode/components/AudioRoutePickerDialog";
import { Text } from "../../base/react";
import { connect } from "../../base/redux";
import { ColorPalette } from "../../base/styles";
import {
    createDesiredLocalTracks,
    destroyLocalTracks,
    getLocalVideoTrack,
} from "../../base/tracks";

import {
    AbstractWelcomePage,
    _mapStateToProps as _abstractMapStateToProps,
} from "./AbstractWelcomePage";
import styles from "./styles";
import { ColorSchemeRegistry } from "../../base/color-scheme";
import { updateSettings } from "../../base/settings";

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

        this.state.auidoRoutePickerOpened = false;

        // Bind event handlers so they are only bound once per instance.
        this._openAudioRoutePicker = this._openAudioRoutePicker.bind(this);
        this._onSelectDeviceFn = this._onSelectDeviceFn.bind(this);
        this._setUpLocalVideoTrack = this._setUpLocalVideoTrack.bind(this);
    }

    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props) {
        const { _devices: devices } = props;

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

        // Make sure devices is alphabetically sorted.
        return {
            devices: _.sortBy(audioDevices, "text"),
        };
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

        AudioMode.setMode(AudioMode.VIDEO_CALL).catch((err) =>
            logger.error(`Failed to set audio mode ${String(mode)}: ${err}`)
        );

        this._setUpLocalVideoTrack();

        AudioMode.updateDeviceList && AudioMode.updateDeviceList();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props._settings.startWithVideoMuted !==
            prevProps._settings.startWithVideoMuted
        ) {
            this._setUpLocalVideoTrack();
        }
    }

    render() {
        const { t } = this.props;
        const selectedDevice = _.find(
            this.state.devices,
            (device) => device.selected
        );
        const renderOnlyAudioPicker = this.props._settings.startWithVideoMuted;

        return (
            <View style={styles.welcomePageContainer}>
                {!renderOnlyAudioPicker && (
                    <View style={styles.localVideTrackContainer}>
                        <VideoTrack videoTrack={this.props._localVideoTrack} />
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(toggleCameraFacingMode());
                            }}
                            style={styles.toggleCameraBtn}
                        >
                            <Icon
                                src={IconSwitchCamera}
                                size={25}
                                style={{ color: "white" }}
                            />
                        </TouchableOpacity>
                    </View>
                )}
                <View
                    style={[
                        styles.speakersLabelContainer,
                        renderOnlyAudioPicker && { marginTop: 65 },
                    ]}
                >
                    <Icon
                        src={IconDeviceSpeaker}
                        size={20}
                        style={{ color: "#1C8FD8", marginRight: 5 }}
                    />
                    <Text>{t('settings.speakers').toUpperCase()}</Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={this._openAudioRoutePicker}
                        style={styles.spekaersSelector}
                    >
                        <Text style={{ flex: 1 }}>{selectedDevice?.text}</Text>
                        <Icon src={IconArrowDown} size={16} color={this.props._iconColor} />
                    </TouchableOpacity>
                    <View style={styles.speakersDropDown}>
                        <Collapsible
                            collapsed={!this.state.auidoRoutePickerOpened}
                        >
                            {this.state.devices.map(this._renderDevice, this)}
                        </Collapsible>
                    </View>
                </View>
            </View>
        );
    }

    _renderDevice(device) {
        const { icon, selected, text } = device;
        const selectedStyle = selected ? { color: this.props._iconColor } : {};

        return (
            <TouchableHighlight
                key={device.type}
                onPress={this._onSelectDeviceFn(device)}
                underlayColor={ColorPalette.overflowMenuItemUnderlay}
            >
                <View style={styles.deviceRow}>
                    <Icon
                        src={icon}
                        style={[styles.deviceIcon, selectedStyle]}
                    />
                    <Text style={[styles.deviceText, selectedStyle]}>
                        {text}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _setUpLocalVideoTrack() {
        const { dispatch } = this.props;
        if (this.props._settings.startWithVideoMuted) {
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

    _openAudioRoutePicker() {
        this.setState({
            auidoRoutePickerOpened: !this.state.auidoRoutePickerOpened,
        });
    }

    _onSelectDeviceFn(device) {
        return () => {
            this.setState({ auidoRoutePickerOpened: false });
            AudioMode.setAudioDevice(device.uid || device.type);
        };
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
        _localVideoTrack: getLocalVideoTrack(state["features/base/tracks"]),
        _devices: state["features/mobile/audio-mode"].devices,
        _iconColor: ColorSchemeRegistry._getColor(state, '', 'icon'),
        // _reducedUI: state['features/base/responsive-ui'].reducedUI
    };
}

export default translate(connect(_mapStateToProps)(WelcomePage));
