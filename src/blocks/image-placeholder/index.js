/**
 * External dependencies
 */
// import { map } from 'lodash';
const map = require('lodash/map');
/**
 * WordPress dependencies
 */
const { DropZone, FormFileUpload, Placeholder, Button } = wp.components;
const { mediaUpload } = wp.utils;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
const { MediaUpload } = wp.blocks;
const { rawHandler } = wp.blocks;

/**
 *  ImagePlaceHolder is a react component used by blocks containing user configurable images e.g: image and cover image.
 *
 * @param   {Object} props  React props passed to the component.
 *
 * @return {Object} Rendered placeholder.
 */
export default function ImagePlaceHolder( { className, icon, label, onSelectImage, multiple = false } ) {
	const setImage = multiple ? onSelectImage : ( [ image ] ) => onSelectImage( image );
	const onFilesDrop = ( files ) => mediaUpload( files, setImage );
	const onHTMLDrop = ( HTML ) => setImage( map(
		rawHandler( { HTML, mode: 'BLOCKS' } )
			.filter( ( { name } ) => name === 'core/image' ),
		'attributes'
	) );
	const uploadFromFiles = ( event ) => mediaUpload( event.target.files, setImage );
	return (
		<Placeholder
			className={ className }
			instructions={ multiple ?
				__( 'Drag images here or add from media library' ) :
				__( 'Drag image here or add from media library' ) }
			icon={ icon }
			label={ label } >
			<DropZone
				onFilesDrop={ onFilesDrop }
				onHTMLDrop={ onHTMLDrop }
			/>
			<FormFileUpload
				multiple={ multiple }
				isLarge
				className="wp-block-image__upload-button"
				onChange={ uploadFromFiles }
				accept="image/*"
			>
				{ __( 'Upload' ) }
			</FormFileUpload>
			<MediaUpload
				gallery={ multiple }
				multiple={ multiple }
				onSelect={ onSelectImage }
				type="image"
				render={ ( { open } ) => (
					<Button isLarge onClick={ open }>
						{ __( 'Add from Media Library' ) }
					</Button>
				) }
			/>
		</Placeholder>
	);
}
