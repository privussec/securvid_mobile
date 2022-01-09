// @flow

import React, { useEffect } from 'react';

import JitsiScreenWebView from '../../../../base/modal/components/JitsiScreenWebView';
import JitsiStatusBar from '../../../../base/modal/components/JitsiStatusBar';
import { screen } from '../../../../conference/components/native/routes';
import { renderArrowBackButton } from '../../../../welcome/functions.native';

import styles from './styles';


type Props = {

    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: Object
}

/**
 * The URL at which the privacy policy is available to the user.
 */
const PRIVACY_URL = 'https://www.privus.global/privacy-policy';

const PrivacyView = ({ navigation }: Props) => {

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () =>
                renderArrowBackButton(() =>
                    navigation.jumpTo(screen.welcome.main))
        });
    });

    return (
        <>
            <JitsiStatusBar />
            <JitsiScreenWebView
                source = { PRIVACY_URL }
                style = { styles.privacyViewContainer } />
        </>
    );
};

export default PrivacyView;
