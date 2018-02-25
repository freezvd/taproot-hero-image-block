<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package taproot-hero-image-block
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) 
{
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
add_action( 'enqueue_block_assets', 'tr_hero_image_block_assets' );
function tr_hero_image_block_assets() 
{
	// Styles.
	wp_enqueue_style(
		'hero_image-tr-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);

} // End function tr_hero_image_block_assets().


/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
add_action( 'enqueue_block_editor_assets', 'tr_hero_image_editor_assets', 500 );
function tr_hero_image_editor_assets() 
{
	// Scripts.
	wp_enqueue_script(
		'tr-hero-image-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ) // Dependencies, defined above.
		// filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ) // Version: filemtime — Gets file modification time.
	);

	// Styles.
	wp_enqueue_style(
		'tr-hero-image-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);

} // End function tr_hero_image_editor_assets().


 
/**
 * Add filter before gutenberg parses content. 
 *
 * @since 1.0.0
 */
// add_filter( 'the_content', 'tr_customize_blocks', 8 );
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


/**
 * Function to display hero within a template. Needs to be in the loop. for now. 
 *
 * @since 1.0.0
 */
function tr_print_hero_image_block()
{
	global $post;

	$image_url = get_post_meta($post->ID, 'taproot_hero_image_url', true);
	$hero_title = get_post_meta($post->ID, 'taproot_hero_title', true);
	$overlay_color = get_post_meta($post->ID, 'taproot_hero_overlay_color', true);
	$overlay_opacity = get_post_meta($post->ID, 'taproot_hero_overlay_opacity', true);

	

	printf('<section class="wp-block-taproot-hero-image" style="background-image: url(%s);"><div class="overlay" style="background-color: %s; opacity: %s;""></div><h2>%s</h2></section>',
		$image_url,
		$overlay_color,
		$overlay_opacity,
		$hero_title
	);

}



add_action( 'init', 'tr_my_block_init' );
function tr_my_block_init() 
{
	register_meta( 'post', 'taproot_hero_image_url', array(
		'type' => 'string',
		'show_in_rest' => true,
		'single' => true,
	) );

	register_meta( 'post', 'taproot_hero_title', array(
		'type' => 'string',
		'show_in_rest' => true,
	) );	

	register_meta( 'post', 'taproot_hero_overlay_opacity', array(
		'type' => 'number',
		'show_in_rest' => true,
		'single' => true,
	) );

	register_meta( 'post', 'taproot_hero_overlay_color', array(
		'type' => 'string',
		'show_in_rest' => true,
		'single' => true,
	) );	
	
}
