<?php
/**
 * Plugin Name: Taproot Hero Image Block
 * Plugin URI: https://github.com/skyshab/
 * Description: Creates a new Gutenberg Block for adding a hero image — created via create-guten-block.
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */


// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
