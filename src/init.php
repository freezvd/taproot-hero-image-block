<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function hero_image_cgb_block_assets() {
	// Styles.
	wp_enqueue_style(
		'hero_image-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function hero_image_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'hero_image_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function hero_image_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'hero_image-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ) // Dependencies, defined above.
		// filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ) // Version: filemtime — Gets file modification time.
	);

	// Styles.
	wp_enqueue_style(
		'hero_image-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function hero_image_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'hero_image_cgb_editor_assets', 500 );





// add filter before gutenberg parses content. 

add_filter( 'the_content', 'tr_customize_blocks', 8 );
function tr_customize_blocks( $content ) 
{
	$blocks = gutenberg_parse_blocks( $content );

	foreach ($blocks as $i => $args) 
	{
		if( isset( $args['blockName'] ) && 'taproot/hero-image' === $args['blockName'] )
		{
			$block_content = gutenberg_render_block( $blocks[$i] );
			$content = str_replace( $block_content, '', $content );
			break;
		}
	}

	return $content;
}


function tr_do_gutenberg_hero_image_block()
{
	$blocks = gutenberg_parse_blocks( get_the_content() );
	foreach ($blocks as $i => $args) 
	{
		if( isset( $args['blockName'] ) && 'taproot/hero-image' === $args['blockName'] )
		{
			echo gutenberg_render_block( $blocks[$i] );
			break;
		}
	}
}

