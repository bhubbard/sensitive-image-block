<?php
/**
 * Plugin Name:       Sensitive Image
 * Description:       A WordPress block for displaying potentially sensitive images behind a customizable content warning overlay.
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sensitive-image-block-wp
 *
 * @package SensitiveImage
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function sensitive_image_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'sensitive_image_block_init' );
