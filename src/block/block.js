/**
 * BLOCK: hero-image
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const isEmpty = require('lodash/isEmpty');

import classnames from 'classnames';

const { __ } = wp.i18n;
const el = wp.element.createElement;

const { 
	IconButton,
    PanelBody,
    RangeControl,
    ToggleControl,
    Toolbar
} = wp.components;

const {
	registerBlockType,
	RichText,
	AlignmentToolbar,
	BlockControls,
	MediaUpload,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.blocks;

import { default as ImagePlaceHolder } from '../blocks/image-placeholder';

const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

const HeroImageName = 'taproot/hero-image';

const HeroImageSettings = {
	title: __( 'Hero Image' ),

	description: __( 'Hero Image is a bold image block with an optional title.' ),

	icon: 'format-image',

	category: 'common',

	attributes: {
		title: {
			type: 'array',
			source: 'children',
			selector: 'h2',
		},
		url: {
			type: 'string',
		},
		align: {
			type: 'string',
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
		dimRatio: {
			type: 'number',
			default: 50,
		},
	},

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	edit( { attributes, setAttributes, isSelected, className } ) {
		const { url, title, align, contentAlign, id, hasParallax, dimRatio } = attributes;
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const onSelectImage = ( media ) => setAttributes( { url: media.url, id: media.id } );
		const toggleParallax = () => setAttributes( { hasParallax: ! hasParallax } );
		const setDimRatio = ( ratio ) => setAttributes( { dimRatio: ratio } );

		const style = url ?
			{ backgroundImage: `url(${ url })` } :
			undefined;
		const classes = classnames(
			className,
			contentAlign !== 'center' && `has-${ contentAlign }-content`,
			dimRatioToClass( dimRatio ),
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
			}
		);

		const alignmentToolbar	= (
			<AlignmentToolbar
				value={ contentAlign }
				onChange={ ( nextAlign ) => {
					setAttributes( { contentAlign: nextAlign } );
				} }
			/>
		);
		const controls = isSelected && [
			<BlockControls key="controls">
				<BlockAlignmentToolbar
					value={ align }
					onChange={ updateAlignment }
				/>

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
				<RangeControl
					label={ __( 'Background Dimness' ) }
					value={ dimRatio }
					onChange={ setDimRatio }
					min={ 0 }
					max={ 100 }
					step={ 10 }
				/>
				<PanelBody title={ __( 'Text Alignment' ) }>
					{ alignmentToolbar }
				</PanelBody>
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

	save( { attributes, className } ) {
		const { url, title, hasParallax, dimRatio, align, contentAlign } = attributes;
		const style = url ?
			{ backgroundImage: `url(${ url })` } :
			undefined;
		const classes = classnames(
			className,
			dimRatioToClass( dimRatio ),
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
				[ `has-${ contentAlign }-content` ]: contentAlign !== 'center',
			},
			align ? `align${ align }` : null,
		);

		return (
			<section className={ classes } style={ style }>
				<h2>{ title }</h2>
			</section>
		);
	},
};

function dimRatioToClass( ratio ) {
	return ( ratio === 0 || ratio === 50 ) ?
		null :
		'has-background-dim-' + ( 10 * Math.round( ratio / 10 ) );
}


registerBlockType( HeroImageName, HeroImageSettings );

