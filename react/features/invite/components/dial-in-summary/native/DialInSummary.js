// @flow

import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { type Dispatch } from 'redux';

import { openDialog } from '../../../../base/dialog';
import { translate } from '../../../../base/i18n';
import JitsiScreen from '../../../../base/modal/components/JitsiScreen';
import { LoadingIndicator } from '../../../../base/react';
import { connect } from '../../../../base/redux';
import { screen } from '../../../../conference/components/native/routes';
import { renderArrowBackButton } from '../../../../welcome/functions.native';
import { getDialInfoPageURLForURIString } from '../../../functions';

import DialInSummaryErrorDialog from './DialInSummaryErrorDialog';
import styles, { INDICATOR_COLOR } from './styles';

type Props = {

    dispatch: Dispatch<any>,

    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: Object,

    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    route: Object
};

/**
 * Implements a React native component that displays the dial in info page for a specific room.
 */
class DialInSummary extends Component<Props> {

    /**
     * Initializes a new instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onError = this._onError.bind(this);
        this._onNavigate = this._onNavigate.bind(this);
        this._renderLoading = this._renderLoading.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const {
            navigation
        } = this.props;

        navigation.setOptions({
            headerLeft: () =>
                renderArrowBackButton(() =>
                    navigation.navigate(screen.welcome.main))
        });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { route } = this.props;
        const summaryUrl = route.params?.summaryUrl;

        return (
            <JitsiScreen
                style = { styles.backDrop }>
                <WebView
                    onError = { this._onError }
                    onShouldStartLoadWithRequest = { this._onNavigate }
                    renderLoading = { this._renderLoading }
                    setSupportMultipleWindows = { false }
                    source = {{ uri: getDialInfoPageURLForURIString(summaryUrl) }}
                    startInLoadingState = { true }
                    style = { styles.webView } />
            </JitsiScreen>
        );
    }

    _onError: () => void;

    /**
     * Callback to handle the error if the page fails to load.
     *
     * @returns {void}
     */
    _onError() {
        this.props.dispatch(openDialog(DialInSummaryErrorDialog));
    }

    _onNavigate: Object => Boolean;

    /**
     * Callback to intercept navigation inside the webview and make the native app handle the dial requests.
     *
     * NOTE: We don't navigate to anywhere else form that view.
     *
     * @param {any} request - The request object.
     * @returns {boolean}
     */
    _onNavigate(request) {
        const { url } = request;
        const { route } = this.props;
        const summaryUrl = route.params?.summaryUrl;

        if (url.startsWith('tel:')) {
            Linking.openURL(url);
        }

        return url === getDialInfoPageURLForURIString(summaryUrl);
    }

    _renderLoading: () => React$Component<any>;

    /**
     * Renders the loading indicator.
     *
     * @returns {React$Component<any>}
     */
    _renderLoading() {
        return (
            <View style = { styles.indicatorWrapper }>
                <LoadingIndicator
                    color = { INDICATOR_COLOR }
                    size = 'large' />
            </View>
        );
    }
}

export default translate(connect()(DialInSummary));
