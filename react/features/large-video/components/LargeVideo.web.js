// @flow

import React, { Component } from 'react';

// import { Watermarks } from '../../base/react';
import { connect } from '../../base/redux';
import { InviteMore, Subject } from '../../conference';
import { fetchCustomBrandingData } from '../../dynamic-branding';
import { Captions } from '../../subtitles/';
import { setFullScreen } from '../../toolbox/actions.web';

declare var interfaceConfig: Object;

type Props = {

    /**
     * The user selected background color.
     */
     _customBackgroundColor: string,

    /**
     * The user selected background image url.
     */
     _customBackgroundImageUrl: string,

    /**
     * Fetches the branding data.
     */
    _fetchCustomBrandingData: Function,

    /**
     * Fetches the branding data.
     */
    _toggleFullScreen: Function,

    /**
     * Prop that indicates whether the chat is open.
     */
    _isChatOpen: boolean,

    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean
}

/**
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * the conference participant who is on the local stage) on Web/React.
 *
 * @extends Component
 */
class LargeVideo extends Component<Props> {
    /**
     * Initializes a new DesktopSourcePreview instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._onDoubleClick = this._onDoubleClick.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.props._fetchCustomBrandingData();
    }

    /**
     * Toggle full screen.
     *
     * @returns {void}
     */
    _onDoubleClick() {
        this.props._toggleFullScreen();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const style = this._getCustomSyles();
        const className = `videocontainer${this.props._isChatOpen ? ' shift-right' : ''}`;

        return (
            <div
                className = { className }
                id = 'largeVideoContainer'
                style = { style }>
                <Subject />
                <InviteMore />
                <div id = 'sharedVideo'>
                    <div id = 'sharedVideoIFrame' />
                </div>
                <div id = 'etherpad' />

                {/* Threeveta change. */}
                {/* The watermark is moved to the Subject component. In order */}
                {/* to be presened side by side with the TvtConnectionIndicator component. */}
                {/* <Watermarks /> */}

                <div id = 'dominantSpeaker'>
                    <div className = 'dynamic-shadow' />
                    <div id = 'dominantSpeakerAvatarContainer' />
                </div>
                <div id = 'remotePresenceMessage' />
                <span id = 'remoteConnectionMessage' />
                <div id = 'largeVideoElementsContainer'>
                    <div id = 'largeVideoBackgroundContainer' />

                    {/*
                      * FIXME: the architecture of elements related to the large
                      * video and the naming. The background is not part of
                      * largeVideoWrapper because we are controlling the size of
                      * the video through largeVideoWrapper. That's why we need
                      * another container for the background and the
                      * largeVideoWrapper in order to hide/show them.
                      */}
                    <div
                        id = 'largeVideoWrapper'
                        onDoubleClick = { this._onDoubleClick }>
                        <video
                            autoPlay = { !this.props._noAutoPlayVideo }
                            id = 'largeVideo'
                            muted = { true }
                            playsInline = { true } /* for Safari on iOS to work */ />
                    </div>
                </div>
                { interfaceConfig.DISABLE_TRANSCRIPTION_SUBTITLES
                    || <Captions /> }
            </div>
        );
    }

    /**
     * Creates the custom styles object.
     *
     * @private
     * @returns {Object}
     */
    _getCustomSyles() {
        const styles = {};
        const { _customBackgroundColor, _customBackgroundImageUrl } = this.props;

        styles.backgroundColor = _customBackgroundColor || interfaceConfig.DEFAULT_BACKGROUND;

        // Threeveta custom background image
        // passed through the interfaceConfig
        const tvtBg = interfaceConfig.DEFAULT_BACKGROUND_IMAGE || _customBackgroundImageUrl;

        if (tvtBg) {
            styles.backgroundImage = `url(${tvtBg})`;
            styles.backgroundSize = 'cover';
        }

        return styles;
    }
}


/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const testingConfig = state['features/base/config'].testing;
    const { backgroundColor, backgroundImageUrl } = state['features/dynamic-branding'];
    const { isOpen: isChatOpen } = state['features/chat'];

    return {
        _customBackgroundColor: backgroundColor,
        _customBackgroundImageUrl: backgroundImageUrl,
        _isChatOpen: isChatOpen,
        _noAutoPlayVideo: testingConfig?.noAutoPlayVideo
    };
}

/**
 * Maps dispatching of some action to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @private
 * @returns {{
 *     _onUnmount: Function
 * }}
 */
function _mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        _fetchCustomBrandingData() {
            dispatch(fetchCustomBrandingData());
        },

        _toggleFullScreen() {
            dispatch(setFullScreen(!document.fullscreenElement));
        }
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(LargeVideo);
