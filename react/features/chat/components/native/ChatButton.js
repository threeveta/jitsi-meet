// @flow
import React from 'react'
import { CHAT_ENABLED, getFeatureFlag } from '../../../base/flags';
import { IconChat, IconChatUnread } from '../../../base/icons';
import { setActiveModalId } from '../../../base/modal';
import { getLocalParticipant } from '../../../base/participants';
import { connect } from '../../../base/redux';
import {
    AbstractButton,
    type AbstractButtonProps
} from '../../../base/toolbox/components';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import ToolboxItem from '../../../base/toolbox/components/ToolboxItem'
import { openDisplayNamePrompt } from '../../../display-name';
import { CHAT_VIEW_MODAL_ID } from '../../constants';
import { getUnreadCount } from '../../functions';
import { openChat } from '../../actions.any';
import { View, Text } from 'react-native';

import styles from './styles';

type Props = AbstractButtonProps & {

    /**
     * Function to display chat.
     *
     * @protected
     */
    _displayChat: Function,

    /**
     * Function to diaply the name prompt before displaying the chat
     * window, if the user has no display name set.
     */
    _displayNameInputDialog: Function,

    /**
     * Whether or not to block chat access with a nickname input form.
     */
    _showNamePrompt: boolean,

    /**
     * The unread message count.
     */
    _unreadMessageCount: number
};

/**
 * Implements an {@link AbstractButton} to open the chat screen on mobile.
 */
class ChatButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.chat';
    icon = IconChat;
    label = 'toolbar.chat';
    toggledIcon = IconChatUnread;

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props._openChat()
        // if (this.props._showNamePrompt) {
        //     this.props._displayNameInputDialog(() => {
        //         this.props._displayChat();
        //     });
        // } else {
        //     this.props._displayChat();
        // }
    }

    /**
     * Renders the button toggled when there are unread messages.
     *
     * @protected
     * @returns {boolean}
     */
    // _isToggled() {
    //     return Boolean(this.props._unreadMessageCount);
    // }

    render(): React$Node {
        const props = {
            ...this.props,
            accessibilityLabel: this.accessibilityLabel,
            disabled: this._isDisabled(),
            elementAfter: this._getElementAfter(),
            icon: this._getIcon(),
            label: this._getLabel(),
            styles: this._getStyles(),
            toggled: this._isToggled(),
            tooltip: this._getTooltip()
        };

        const { _unreadMessageCount } = this.props

        return (
            <View>
                <ToolboxItem
                    disabled = { this._isDisabled() }
                    onClick = { this._onClick }
                    { ...props } />
                {_unreadMessageCount > 0 && (
                    <View style={this.props._styles.unreadIndicatorContainer}>
                        <Text style={styles.unreadText}>
                            {_unreadMessageCount > 9 ? '9+' : _unreadMessageCount}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

/**
 * Maps redux actions to the props of the component.
 *
 * @param {Function} dispatch - The redux action {@code dispatch} function.
 * @returns {{
 *     _displayChat,
 *     _displayNameInputDialog
 * }}
 * @private
 */
function _mapDispatchToProps(dispatch: Function) {
    return {
        /**
         * Launches native invite dialog.
         *
         * @private
         * @returns {void}
         */
        _displayChat() {
            dispatch(setActiveModalId(CHAT_VIEW_MODAL_ID));
        },

        /**
         * Displays a display name prompt.
         *
         * @param {Function} onPostSubmit - The function to invoke after a
         * succesfulsetting of the display name.
         * @returns {void}
         */
        _displayNameInputDialog(onPostSubmit) {
            dispatch(openDisplayNamePrompt(onPostSubmit));
        },

        /**
         * Opens threeveta chat through native code
         *
         * @private
         * @returns {void}
         */
        _openChat() {
            dispatch(openChat())
        }
    };
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    const localParticipant = getLocalParticipant(state);
    const enabled = true; //getFeatureFlag(state, CHAT_ENABLED, true);
    const { visible = enabled } = ownProps;

    return {
        _showNamePrompt: !localParticipant.name,
        _unreadMessageCount: getUnreadCount(state),
        visible,
        _styles: ColorSchemeRegistry.get(state, 'Chat')
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(ChatButton);
