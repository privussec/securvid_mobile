// @flow

import React from 'react';

import { translate } from '../../../base/i18n';
import Message from '../../../base/react/components/web/Message';
import { MESSAGE_TYPE_LOCAL } from '../../constants';
import AbstractChatMessage, { type Props } from '../AbstractChatMessage';

import PrivateMessageButton from './PrivateMessageButton';

/**
 * Renders a single chat message.
 */
class ChatMessage extends AbstractChatMessage<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { message, t } = this.props;

        return (
            <div
                className = 'chatmessage-wrapper'
                tabIndex = { -1 }>
                <div className = { `chatmessage ${message.privateMessage ? 'privatemessage' : ''}` }>
                    <div className = 'replywrapper'>
                        <div className = 'messagecontent'>
                            { this.props.showDisplayName && this._renderDisplayName() }
                            <div className = 'usermessage'>
                                <span className = 'sr-only'>
                                    { this.props.message.displayName === this.props.message.recipient
                                        ? t('chat.messageAccessibleTitleMe')
                                        : t('chat.messageAccessibleTitle',
                                        { user: this.props.message.displayName }) }
                                </span>
                                <Message text = { this._getMessageText() } />
                            </div>
                            { message.privateMessage && this._renderPrivateNotice() }
                        </div>
                        { message.privateMessage && message.messageType !== MESSAGE_TYPE_LOCAL
                            && (
                                <div className = 'messageactions'>
                                    <PrivateMessageButton
                                        participantID = { message.id }
                                        reply = { true }
                                        showLabel = { false } />
                                </div>
                            ) }
                    </div>
                </div>
                { this.props.showTimestamp && this._renderTimestamp() }
            </div>
        );
    }

    _getFormattedTimestamp: () => string;

    _getMessageText: () => string;

    _getPrivateNoticeMessage: () => string;

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderDisplayName() {
        return (
            <div
                aria-hidden = { true }
                className = 'display-name'>
                { this.props.message.displayName }
            </div>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    _renderPrivateNotice() {
        return (
            <div className = 'privatemessagenotice'>
                { this._getPrivateNoticeMessage() }
            </div>
        );
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    _renderTimestamp() {
        return (
            <div className = 'timestamp'>
                { this._getFormattedTimestamp() }
            </div>
        );
    }
}

export default translate(ChatMessage);
