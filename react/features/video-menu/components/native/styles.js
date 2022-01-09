// @flow

import {
    MD_FONT_SIZE,
    MD_ITEM_HEIGHT,
    MD_ITEM_MARGIN_PADDING
} from '../../../base/dialog';
import { ColorPalette, createStyleSheet } from '../../../base/styles';
import BaseTheme from '../../../base/ui/components/BaseTheme.native';

export default createStyleSheet({
    participantNameContainer: {
        alignItems: 'center',
        borderBottomColor: BaseTheme.palette.dividerColor,
        borderBottomWidth: 0.4,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        flexDirection: 'row',
        height: MD_ITEM_HEIGHT,
        paddingLeft: MD_ITEM_MARGIN_PADDING
    },

    participantNameLabel: {
        color: ColorPalette.lightGrey,
        flexShrink: 1,
        fontSize: MD_FONT_SIZE,
        marginLeft: MD_ITEM_MARGIN_PADDING,
        opacity: 0.90
    },

    statsTitleText: {
        color: BaseTheme.palette.text01,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 3
    },

    statsInfoText: {
        color: BaseTheme.palette.text01,
        fontSize: 16,
        marginRight: 2,
        marginLeft: 2
    },

    statsInfoCell: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 30,
        justifyContent: 'flex-start'
    },

    statsWrapper: {
        margin: BaseTheme.spacing[3]
    },

    volumeSliderContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: BaseTheme.spacing[3],
        marginVertical: BaseTheme.spacing[2]
    },

    sliderContainer: {
        marginLeft: BaseTheme.spacing[3],
        minWidth: '80%'
    },

    divider: {
        backgroundColor: BaseTheme.palette.dividerColor
    },

    dividerWithSpacing: {
        backgroundColor: BaseTheme.palette.dividerColor,
        marginVertical: BaseTheme.spacing[3]
    },

    toggleContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden'
    },

    toggleLabel: {
        marginRight: BaseTheme.spacing[3],
        maxWidth: '70%'
    },

    contextMenuItem: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme.spacing[7],
        marginLeft: BaseTheme.spacing[3]
    },

    contextMenuItemText: {
        ...BaseTheme.typography.bodyShortRegularLarge,
        color: BaseTheme.palette.text01,
        marginLeft: BaseTheme.spacing[4]
    }
});
