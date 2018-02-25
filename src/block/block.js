/**
 * BLOCK: hero-image
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import './style.scss';
import './editor.scss';

const isEmpty = require('lodash/isEmpty');

import classnames from 'classnames';

const { __ } = wp.i18n;
const el = wp.element.createElement;

const { 
	IconButton,
	Button,
    PanelBody,
	PanelColor,    
    RangeControl,
    ToggleControl,
    Toolbar
} = wp.components;

const {
	registerBlockType,
	RichText,
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	MediaUpload,
	BlockAlignmentToolbar,
	InspectorControls,
	ColorPalette,
} = wp.blocks;

import { default as ImagePlaceHolder } from '../blocks/image-placeholder';

const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

const HeroImageName = 'taproot/hero-image';

const HeroImageSettings = {
	title: __( 'Hero Image' ),

	description: __( 'The Hero Image block is an image and optional title that can be inserted into the template.' ),

	icon: 'format-image',

	category: 'common',

	attributes: {
		title: {
			type: 'string',
			source: 'meta',
			selector: 'h2',
			meta: 'taproot_hero_title',						
		},
		url: {
			type: 'string',
			source: 'meta',			
			meta: 'taproot_hero_image_url',			
		},
		contentAlign: {
			type: 'string',
			default: 'center',
		},
		id: {
			type: 'number',
		},
		hasParallax: {
			type: 'boolean',
			default: false,
		},
		overlayColor: {
			type: 'string',
			source: 'meta',			
			meta: 'taproot_hero_overlay_color',	
		},
		dimRatio: {
			type: 'number',
			default: 0.50,
			source: 'meta',
			meta: 'taproot_hero_overlay_opacity',				
		},		
	},

	useOnce: true,

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	edit( { attributes, setAttributes, isSelected, className } ) {
		const { url, title, contentAlign, id, hasParallax, overlayColor, dimRatio } = attributes;
		const onSelectImage = ( media ) => setAttributes( { url: media.url, id: media.id } );
		const toggleParallax = () => setAttributes( { hasParallax: ! hasParallax } );
		const setDimRatio = ( ratio ) => setAttributes( { dimRatio: ratio } );

		const style = url ?
			{ backgroundImage: `url(${ url })` } :
			undefined;
		const classes = classnames(
			className,
			contentAlign !== 'center' && `has-${ contentAlign }-content`,
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
			}
		);

		const alignmentToolbar = (
			<AlignmentToolbar
				value={ contentAlign }
				onChange={ ( nextAlign ) => {
					setAttributes( { contentAlign: nextAlign } );
				} }
			/>
		);
		const controls = isSelected && [
			<BlockControls key="controls">
				{ alignmentToolbar }
				<Toolbar>
					<MediaUpload
						onSelect={ onSelectImage }
						type="image"
						value={ id }
						render={ ( { open } ) => (
							<IconButton
								className="components-toolbar__control"
								label={ __( 'Edit image' ) }
								icon="edit"
								onClick={ open }
							/>
						) }
					/>
				</Toolbar>
			</BlockControls>,
			<InspectorControls key="inspector">
				<h2>{ __( 'Hero Image Settings' ) }</h2>
				<ToggleControl
					label={ __( 'Fixed Background' ) }
					checked={ !! hasParallax }
					onChange={ toggleParallax }
				/>				
				<PanelColor title={ __( 'Overlay Color' ) } colorValue={ overlayColor } initialOpen={ false }>
					<ColorPalette
						value={ overlayColor }
						onChange={ ( colorValue ) => setAttributes( { overlayColor: colorValue } ) }
					/>	
				</PanelColor>
				<RangeControl
					label={ __( 'Overlay Opacity' ) }
					value={ dimRatio }
					onChange={ setDimRatio }
					min={ 0 }
					max={ 1 }
					step={ 0.01 }
				/>
			</InspectorControls>,
		];

		if ( ! url ) {
			const hasTitle = ! isEmpty( title );
			const icon = hasTitle ? undefined : 'format-image';
			const label = hasTitle ? (
				<RichText
					tagName="h2"
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					isSelected={ isSelected }
					inlineToolbar
				/>
			) : __( 'Hero Image' );

			return [ controls,
				<ImagePlaceHolder key="hero-image-placeholder"
					{ ...{ className, icon, label, onSelectImage } }
				/>,
			];
		}

		return [controls,
			<section
				key="preview"
				data-url={ url }
				style={ style }
				className={ classes }
			>
				{ el(
					'div', 
					{ className: 'overlay', style: {backgroundColor: overlayColor, opacity: dimRatio} }
				) }
				{ title || isSelected ? (
					<RichText
						tagName="h2"
						placeholder={ __( 'Write title…' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						isSelected={ isSelected }
						inlineToolbar
					/>
				) : null }	

			</section>,
		];
	},

	save() {
		return null;
	},
};


registerBlockType( HeroImageName, HeroImageSettings );

