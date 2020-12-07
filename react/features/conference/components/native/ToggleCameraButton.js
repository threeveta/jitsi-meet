// @flow
import React, { PureComponent } from "react";
import { translate } from "../../../base/i18n";
import { Icon, IconSwitchCamera } from "../../../base/icons";
import { MEDIA_TYPE, toggleCameraFacingMode } from "../../../base/media";
import { connect } from "../../../base/redux";
import { isToolboxVisible } from '../../../toolbox/functions';
import { isLocalTrackMuted } from "../../../base/tracks";
import { TouchableOpacity } from "react-native";
import styles from "./styles";
import { ColorPalette } from "../../../base/styles";

/**
 * The type of the React {@code Component} props of {@link ToggleCameraButton}.
 */
type Props = AbstractButtonProps & {
    /**
     * Whether the current conference is in audio only mode or not.
     */
    _audioOnly: boolean,

    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,
};

/**
 * An implementation of a button for toggling the camera facing mode.
 */
class ToggleCameraButton extends PureComponent<Props> {
    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
        this._isDisabled = this._isDisabled.bind(this);
    }

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch(toggleCameraFacingMode());
    }

    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._audioOnly || this.props._videoMuted || !this.props._toolboxVisible;
    }

    render() {
        if (this._isDisabled()) return null;
        return (
            <TouchableOpacity
                style={styles.toggleCameraBtn}
                onPress={this._handleClick}
            >
                <Icon
                    src={IconSwitchCamera}
                    size={25}
                    style={{ color: ColorPalette.darkGrey }}
                />
            </TouchableOpacity>
        );
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleCameraButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _videoMuted: boolean
 * }}
 */
function _mapStateToProps(state): Object {
    const { enabled: audioOnly } = state["features/base/audio-only"];
    const tracks = state["features/base/tracks"];

    return {
        _audioOnly: Boolean(audioOnly),
        _videoMuted: isLocalTrackMuted(tracks, MEDIA_TYPE.VIDEO),
        _toolboxVisible: isToolboxVisible(state),
    };
}

export default translate(connect(_mapStateToProps)(ToggleCameraButton));
