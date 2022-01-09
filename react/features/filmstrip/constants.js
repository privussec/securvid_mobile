// @flow

import { BoxModel } from '../base/styles';
import { LAYOUTS } from '../video-layout/constants';

/**
 * The size (height and width) of the small (not tile view) thumbnails.
 */
export const SMALL_THUMBNAIL_SIZE = 80;

/**
 * The height of the filmstrip in narrow aspect ratio, or width in wide.
 */
export const FILMSTRIP_SIZE = SMALL_THUMBNAIL_SIZE + BoxModel.margin;

/**
 * The aspect ratio of a tile in tile view.
 */
export const TILE_ASPECT_RATIO = 16 / 9;

/**
 * The aspect ratio of a square tile in tile view.
 */
export const SQUARE_TILE_ASPECT_RATIO = 1;

/**
 * Width below which the overflow menu(s) will be displayed as drawer(s).
 */
export const DISPLAY_DRAWER_THRESHOLD = 512;

/**
 * Breakpoint past which a single column view is enforced in tile view.
 */
export const SINGLE_COLUMN_BREAKPOINT = 300;

/**
 * Breakpoint past which a two column view is enforced in tile view.
 */
export const TWO_COLUMN_BREAKPOINT = 1000;

/**
 * Breakpoint past which the aspect ratio is switched in tile view.
 * Also, past this breakpoint, if there are two participants in the conference, we enforce
 * single column view.
 * If this is to be modified, please also change the related media query from the tile_view scss file.
 */
export const ASPECT_RATIO_BREAKPOINT = 500;

/**
 * Minimum height of tile for small screens.
 */
export const TILE_MIN_HEIGHT_SMALL = 150;

/**
 * Minimum height of tile for large screens.
 */
export const TILE_MIN_HEIGHT_LARGE = 200;

/**
 * Aspect ratio for portrait tiles. (height / width).
 */
export const TILE_PORTRAIT_ASPECT_RATIO = 1.3;

/**
 * The default number of columns for tile view.
 */
export const DEFAULT_MAX_COLUMNS = 5;

/**
 * An extended number of columns for tile view.
 */
export const ABSOLUTE_MAX_COLUMNS = 7;

/**
 * An array of attributes of the video element that will be used for adding a listener for every event in the list.
 * The latest event will be stored in redux. This is currently used by torture only.
 */
export const VIDEO_TEST_EVENTS = [
    'onAbort',
    'onCanPlay',
    'onCanPlayThrough',
    'onEmptied',
    'onEnded',
    'onError',
    'onLoadedData',
    'onLoadedMetadata',
    'onLoadStart',
    'onPause',
    'onPlay',
    'onPlaying',
    'onRateChange',
    'onStalled',
    'onSuspend',
    'onWaiting'
];


/**
 * Display mode constant used when video is being displayed on the small video.
 *
 * @type {number}
 * @constant
 */
export const DISPLAY_VIDEO = 0;

/**
 * Display mode constant used when the user's avatar is being displayed on
 * the small video.
 *
 * @type {number}
 * @constant
 */
export const DISPLAY_AVATAR = 1;

/**
 * Maps the display modes to class name that will be applied on the thumbnail container.
 *
 * @type {Array<string>}
 * @constant
 */
export const DISPLAY_MODE_TO_CLASS_NAME = [
    'display-video',
    'display-avatar-only'
];

/**
 * The vertical margin of a tile.
 *
 * @type {number}
 */
export const TILE_VERTICAL_MARGIN = 4;

/**
 * The horizontal margin of a tile.
 *
 * @type {number}
 */
export const TILE_HORIZONTAL_MARGIN = 4;

/**
 * The vertical margin of the tile grid container.
 *
 * @type {number}
 */
export const TILE_VIEW_GRID_VERTICAL_MARGIN = 12;

/**
 * The horizontal margin of the tile grid container.
 *
 * @type {number}
 */
export const TILE_VIEW_GRID_HORIZONTAL_MARGIN = 12;

/**
 * The height of the whole toolbar.
 */
export const TOOLBAR_HEIGHT = 72;

/**
 * The height of the whole toolbar.
 */
export const TOOLBAR_HEIGHT_MOBILE = 60;

/**
 * The size of the horizontal border of a thumbnail.
 *
 * @type {number}
 */
export const STAGE_VIEW_THUMBNAIL_HORIZONTAL_BORDER = 4;

/**
 * The size of the vertical border of a thumbnail.
 *
 * @type {number}
 */
export const STAGE_VIEW_THUMBNAIL_VERTICAL_BORDER = 4;

/**
 * The size of the scroll.
 *
 * @type {number}
 */
export const SCROLL_SIZE = 7;

/**
 * The total vertical space between the thumbnails container and the edges of the window.
 *
 * NOTE: This will include margins, paddings and the space for the 'hide filmstrip' icon.
 *
 * @type {number}
 */
export const VERTICAL_FILMSTRIP_VERTICAL_MARGIN = 60;

/**
 * The min horizontal space between the thumbnails container and the edges of the window.
 *
 * @type {number}
 */
export const VERTICAL_FILMSTRIP_MIN_HORIZONTAL_MARGIN = 10;

/**
 * The total horizontal space between the thumbnails container and the edges of the window.
 *
 * NOTE: This will include margins, paddings and the space for the 'hide filmstrip' icon.
 *
 * @type {number}
 */
export const HORIZONTAL_FILMSTRIP_MARGIN = 39;

/**
 * Sets after how many ms to show the thumbnail context menu on long touch on mobile.
 *
 * @type {number}
 */
export const SHOW_TOOLBAR_CONTEXT_MENU_AFTER = 600;

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * NOTE: Mobile specific.
 *
 * @private
 * @type {number}
 */
export const TILE_MARGIN = 10;

/**
 * The popover position for the connection stats table.
 */
export const STATS_POPOVER_POSITION = {
    [LAYOUTS.TILE_VIEW]: 'right-start',
    [LAYOUTS.VERTICAL_FILMSTRIP_VIEW]: 'left-start',
    [LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW]: 'top-end'
};

/**
 * The tooltip position for the indicators on the thumbnail.
 */
export const INDICATORS_TOOLTIP_POSITION = {
    [LAYOUTS.TILE_VIEW]: 'right',
    [LAYOUTS.VERTICAL_FILMSTRIP_VIEW]: 'left',
    [LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW]: 'top'
};
