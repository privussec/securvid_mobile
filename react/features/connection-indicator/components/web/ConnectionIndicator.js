// @flow

import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import type { Dispatch } from 'redux';

import { translate } from '../../../base/i18n';
import { Icon, IconConnectionActive, IconConnectionInactive } from '../../../base/icons';
import { JitsiParticipantConnectionStatus } from '../../../base/lib-jitsi-meet';
import { getLocalParticipant, getParticipantById } from '../../../base/participants';
import { Popover } from '../../../base/popover';
import { connect } from '../../../base/redux';
import AbstractConnectionIndicator, {
    INDICATOR_DISPLAY_THRESHOLD,
    type Props as AbstractProps,
    type State as AbstractState
} from '../AbstractConnectionIndicator';

import ConnectionIndicatorContent from './ConnectionIndicatorContent';

/**
 * An array of display configurations for the connection indicator and its bars.
 * The ordering is done specifically for faster iteration to find a matching
 * configuration to the current connection strength percentage.
 *
 * @type {Object[]}
 */
const QUALITY_TO_WIDTH: Array<Object> = [

    // Full (3 bars)
    {
        colorClass: 'status-high',
        percent: INDICATOR_DISPLAY_THRESHOLD,
        tip: 'connectionindicator.quality.good'
    },

    // 2 bars
    {
        colorClass: 'status-med',
        percent: 10,
        tip: 'connectionindicator.quality.nonoptimal'
    },

    // 1 bar
    {
        colorClass: 'status-low',
        percent: 0,
        tip: 'connectionindicator.quality.poor'
    }

    // Note: we never show 0 bars as long as there is a connection.
];

/**
 * The type of the React {@code Component} props of {@link ConnectionIndicator}.
 */
type Props = AbstractProps & {

    /**
     * The current condition of the user's connection, matching one of the
     * enumerated values in the library.
     */
    _connectionStatus: string,

    /**
     * Disable/enable inactive indicator.
     */
    _connectionIndicatorInactiveDisabled: boolean,

    /**
     * Wether the indicator popover is disabled.
     */
    _popoverDisabled: boolean,

    /**
     * Whether or not the component should ignore setting a visibility class for
     * hiding the component when the connection quality is not strong.
     */
    alwaysVisible: boolean,

    /**
     * The audio SSRC of this client.
     */
    audioSsrc: number,

    /**
     * An object containing the CSS classes.
     */
    classes: Object,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,


    /**
     * Whether or not clicking the indicator should display a popover for more
     * details.
     */
    enableStatsDisplay: boolean,

    /**
     * The font-size for the icon.
     */
    iconSize: number,

    /**
     * Relative to the icon from where the popover for more connection details
     * should display.
     */
    statsPopoverPosition: string,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function,
};

type State = AbstractState & {

    /**
     * Whether popover is ivisible or not.
     */
    popoverVisible: boolean
}

const styles = theme => {
    return {
        container: {
            display: 'inline-block'
        },

        hidden: {
            display: 'none'
        },

        icon: {
            padding: '6px',
            borderRadius: '4px',

            '&.status-high': {
                backgroundColor: theme.palette.success01
            },

            '&.status-med': {
                backgroundColor: theme.palette.warning01
            },

            '&.status-low': {
                backgroundColor: theme.palette.iconError
            },

            '&.status-disabled': {
                background: 'transparent'
            },

            '&.status-lost': {
                backgroundColor: theme.palette.ui05
            },

            '&.status-other': {
                backgroundColor: theme.palette.action01
            }
        },

        inactiveIcon: {
            padding: 0,
            borderRadius: '50%'
        }
    };
};

/**
 * Implements a React {@link Component} which displays the current connection
 * quality percentage and has a popover to show more detailed connection stats.
 *
 * @augments {Component}
 */
class ConnectionIndicator extends AbstractConnectionIndicator<Props, State> {
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            showIndicator: false,
            stats: {},
            popoverVisible: false
        };
        this._onShowPopover = this._onShowPopover.bind(this);
        this._onHidePopover = this._onHidePopover.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { enableStatsDisplay, participantId, statsPopoverPosition, classes } = this.props;
        const visibilityClass = this._getVisibilityClass();

        if (this.props._popoverDisabled) {
            return this._renderIndicator();
        }

        return (
            <Popover
                className = { clsx(classes.container, visibilityClass) }
                content = { <ConnectionIndicatorContent
                    inheritedStats = { this.state.stats }
                    participantId = { participantId } /> }
                disablePopover = { !enableStatsDisplay }
                id = 'participant-connection-indicator'
                noPaddingContent = { true }
                onPopoverClose = { this._onHidePopover }
                onPopoverOpen = { this._onShowPopover }
                position = { statsPopoverPosition }
                visible = { this.state.popoverVisible }>
                { this._renderIndicator() }
            </Popover>
        );
    }

    /**
     * Returns a CSS class that interprets the current connection status as a
     * color.
     *
     * @private
     * @returns {string}
     */
    _getConnectionColorClass() {
        const { _connectionStatus } = this.props;
        const { percent } = this.state.stats;
        const { INACTIVE, INTERRUPTED } = JitsiParticipantConnectionStatus;

        if (_connectionStatus === INACTIVE) {
            if (this.props._connectionIndicatorInactiveDisabled) {
                return 'status-disabled';
            }

            return 'status-other';
        } else if (_connectionStatus === INTERRUPTED) {
            return 'status-lost';
        } else if (typeof percent === 'undefined') {
            return 'status-high';
        }

        return this._getDisplayConfiguration(percent).colorClass;
    }

    /**
     * Get the icon configuration from QUALITY_TO_WIDTH which has a percentage
     * that matches or exceeds the passed in percentage. The implementation
     * assumes QUALITY_TO_WIDTH is already sorted by highest to lowest
     * percentage.
     *
     * @param {number} percent - The connection percentage, out of 100, to find
     * the closest matching configuration for.
     * @private
     * @returns {Object}
     */
    _getDisplayConfiguration(percent: number): Object {
        return QUALITY_TO_WIDTH.find(x => percent >= x.percent) || {};
    }

    /**
     * Returns additional class names to add to the root of the component. The
     * class names are intended to be used for hiding or showing the indicator.
     *
     * @private
     * @returns {string}
     */
    _getVisibilityClass() {
        const { _connectionStatus, classes } = this.props;

        return this.state.showIndicator
            || this.props.alwaysVisible
            || _connectionStatus === JitsiParticipantConnectionStatus.INTERRUPTED
            || _connectionStatus === JitsiParticipantConnectionStatus.INACTIVE
            ? '' : classes.hidden;
    }

    _onHidePopover: () => void;

    /**
     * Hides popover.
     *
     * @private
     * @returns {void}
     */
    _onHidePopover() {
        this.setState({ popoverVisible: false });
    }

    /**
     * Creates a ReactElement for displaying an icon that represents the current
     * connection quality.
     *
     * @returns {ReactElement}
     */
    _renderIcon() {
        const colorClass = this._getConnectionColorClass();

        if (this.props._connectionStatus === JitsiParticipantConnectionStatus.INACTIVE) {
            if (this.props._connectionIndicatorInactiveDisabled) {
                return null;
            }

            return (
                <span className = 'connection_ninja'>
                    <Icon
                        className = { clsx(this.props.classes.icon, this.props.classes.inactiveIcon, colorClass) }
                        size = { 24 }
                        src = { IconConnectionInactive } />
                </span>
            );
        }

        let emptyIconWrapperClassName = 'connection_empty';

        if (this.props._connectionStatus
            === JitsiParticipantConnectionStatus.INTERRUPTED) {

            // emptyIconWrapperClassName is used by the torture tests to
            // identify lost connection status handling.
            emptyIconWrapperClassName = 'connection_lost';
        }

        return (
            <span className = { emptyIconWrapperClassName }>
                <Icon
                    className = { clsx(this.props.classes.icon, colorClass) }
                    size = { 12 }
                    src = { IconConnectionActive } />
            </span>
        );
    }

    _onShowPopover: () => void;

    /**
     * Shows popover.
     *
     * @private
     * @returns {void}
     */
    _onShowPopover() {
        this.setState({ popoverVisible: true });
    }


    /**
     * Creates a ReactElement for displaying the indicator (GSM bar).
     *
     * @returns {ReactElement}
     */
    _renderIndicator() {
        return (
            <div
                style = {{ fontSize: this.props.iconSize }}>
                {this._renderIcon()}
            </div>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Props} ownProps - The own props of the component.
 * @returns {Props}
 */
export function _mapStateToProps(state: Object, ownProps: Props) {
    const { participantId } = ownProps;
    const participant
        = participantId ? getParticipantById(state, participantId) : getLocalParticipant(state);

    return {
        _connectionIndicatorInactiveDisabled:
        Boolean(state['features/base/config'].connectionIndicators?.inactiveDisabled),
        _popoverDisabled: state['features/base/config'].connectionIndicators?.disableDetails,
        _connectionStatus: participant?.connectionStatus
    };
}
export default translate(connect(_mapStateToProps)(
    withStyles(styles)(ConnectionIndicator)));
