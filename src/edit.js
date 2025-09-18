/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InspectorControls,
	MediaPlaceholder,
	RichText,
	BlockControls,
	MediaReplaceFlow,
	__experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';

import {
	PanelBody,
	TextControl,
	RangeControl,
	Button,
	ColorPicker,
	ToolbarButton,
	Popover
} from '@wordpress/components';

import { 
	useSelect
} from '@wordpress/data';

import { 
	useState
} from '@wordpress/element';

import { 
	crop,
	link,
	linkOff
} from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, isSelected, clientId }) {
	const {
		imageId,
		imageUrl,
		imageAlt,
		caption,
		href,
		linkTarget,
		rel,
		linkClass,
		warningText,
		revealButtonText,
		hideButtonText,
		overlayBackgroundColor,
		overlayOpacity,
		blurIntensity,
		buttonBackgroundColor,
		buttonTextColor
	} = attributes;

	const [showOverlayPreview, setShowOverlayPreview] = useState(true);
	const [isLinkUIOpen, setIsLinkUIOpen] = useState(false);

	// Handle image selection
	const onSelectImage = (media) => {
		if (!media || !media.url) {
			setAttributes({
				imageUrl: undefined,
				imageAlt: undefined,
				imageId: undefined,
				caption: undefined,
			});
			return;
		}

		setAttributes({
			imageUrl: media.url,
			imageId: media.id,
			imageAlt: media.alt || media.title || '',
			caption: media.caption || caption
		});
	};

	// Handle upload error
	const onUploadError = (message) => {
		console.error('Upload error:', message);
	};

	// Link controls
	const onSetHref = (props) => {
		setAttributes(props);
	};

	const onUnlink = () => {
		setAttributes({
			href: undefined,
			linkTarget: undefined,
			rel: undefined,
			linkClass: undefined,
		});
	};

	const linkValue = {
		url: href,
		target: linkTarget,
		linkClass,
		rel,
	};

	const blockProps = useBlockProps({
		className: 'wp-block-telex-sensitive-image'
	});

	if (!imageUrl) {
		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Content Warning Settings', 'sensitive-image-block-wp')}>
						<TextControl
							label={__('Warning Text', 'sensitive-image-block-wp')}
							value={warningText}
							onChange={(value) => setAttributes({ warningText: value })}
							help={__('Text displayed on the overlay warning users about sensitive content', 'sensitive-image-block-wp')}
						/>
						<TextControl
							label={__('Reveal Button Text', 'sensitive-image-block-wp')}
							value={revealButtonText}
							onChange={(value) => setAttributes({ revealButtonText: value })}
						/>
						<TextControl
							label={__('Hide Button Text', 'sensitive-image-block-wp')}
							value={hideButtonText}
							onChange={(value) => setAttributes({ hideButtonText: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Overlay Appearance', 'sensitive-image-block-wp')}>
						<p>{__('Background Color', 'sensitive-image-block-wp')}</p>
						<ColorPicker
							color={overlayBackgroundColor}
							onChangeComplete={(value) => setAttributes({ overlayBackgroundColor: value.hex })}
						/>
						
						<RangeControl
							label={__('Overlay Opacity', 'sensitive-image-block-wp')}
							value={overlayOpacity}
							onChange={(value) => setAttributes({ overlayOpacity: value })}
							min={0.1}
							max={1}
							step={0.1}
						/>

						<RangeControl
							label={__('Background Blur Intensity', 'sensitive-image-block-wp')}
							value={blurIntensity}
							onChange={(value) => setAttributes({ blurIntensity: value })}
							min={0}
							max={20}
							help={__('Amount of blur applied to the image behind the overlay', 'sensitive-image-block-wp')}
						/>
					</PanelBody>

					<PanelBody title={__('Button Styling', 'sensitive-image-block-wp')}>
						<p>{__('Button Background Color', 'sensitive-image-block-wp')}</p>
						<ColorPicker
							color={buttonBackgroundColor}
							onChangeComplete={(value) => setAttributes({ buttonBackgroundColor: value.hex })}
						/>
						
						<p>{__('Button Text Color', 'sensitive-image-block-wp')}</p>
						<ColorPicker
							color={buttonTextColor}
							onChangeComplete={(value) => setAttributes({ buttonTextColor: value.hex })}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<MediaPlaceholder
						icon="warning"
						labels={{
							title: __('Sensitive Image', 'sensitive-image-block-wp'),
							instructions: __('Upload an image that requires a content warning', 'sensitive-image-block-wp'),
						}}
						className="sensitive-image-placeholder"
						allowedTypes={['image']}
						value={{ id: imageId, src: imageUrl }}
						onSelect={onSelectImage}
						onError={onUploadError}
						disableMediaButtons={imageUrl}
					/>
				</div>
			</>
		);
	}

	return (
		<>
			<BlockControls group="block">
				<MediaReplaceFlow
					mediaId={imageId}
					mediaURL={imageUrl}
					allowedTypes={['image']}
					accept="image/*"
					onSelect={onSelectImage}
					onError={onUploadError}
					name={!imageUrl ? __('Add image', 'sensitive-image-block-wp') : __('Replace image', 'sensitive-image-block-wp')}
				/>
				<ToolbarButton
					icon={href ? linkOff : link}
					label={href ? __('Unlink', 'sensitive-image-block-wp') : __('Link', 'sensitive-image-block-wp')}
					onClick={() => {
						if (href) {
							onUnlink();
						} else {
							setIsLinkUIOpen(true);
						}
					}}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Content Warning Settings', 'sensitive-image-block-wp')}>
					<TextControl
						label={__('Warning Text', 'sensitive-image-block-wp')}
						value={warningText}
						onChange={(value) => setAttributes({ warningText: value })}
						help={__('Text displayed on the overlay warning users about sensitive content', 'sensitive-image-block-wp')}
					/>
					<TextControl
						label={__('Reveal Button Text', 'sensitive-image-block-wp')}
						value={revealButtonText}
						onChange={(value) => setAttributes({ revealButtonText: value })}
					/>
					<TextControl
						label={__('Hide Button Text', 'sensitive-image-block-wp')}
						value={hideButtonText}
						onChange={(value) => setAttributes({ hideButtonText: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Overlay Appearance', 'sensitive-image-block-wp')}>
					<p>{__('Background Color', 'sensitive-image-block-wp')}</p>
					<ColorPicker
						color={overlayBackgroundColor}
						onChangeComplete={(value) => setAttributes({ overlayBackgroundColor: value.hex })}
					/>
					
					<RangeControl
						label={__('Overlay Opacity', 'sensitive-image-block-wp')}
						value={overlayOpacity}
						onChange={(value) => setAttributes({ overlayOpacity: value })}
						min={0.1}
						max={1}
						step={0.1}
					/>

					<RangeControl
						label={__('Background Blur Intensity', 'sensitive-image-block-wp')}
						value={blurIntensity}
						onChange={(value) => setAttributes({ blurIntensity: value })}
						min={0}
						max={20}
						help={__('Amount of blur applied to the image behind the overlay', 'sensitive-image-block-wp')}
					/>
				</PanelBody>

				<PanelBody title={__('Button Styling', 'sensitive-image-block-wp')}>
					<p>{__('Button Background Color', 'sensitive-image-block-wp')}</p>
					<ColorPicker
							color={buttonBackgroundColor}
							onChangeComplete={(value) => setAttributes({ buttonBackgroundColor: value.hex })}
						/>
						
					<p>{__('Button Text Color', 'sensitive-image-block-wp')}</p>
					<ColorPicker
							color={buttonTextColor}
							onChangeComplete={(value) => setAttributes({ buttonTextColor: value.hex })}
						/>
				</PanelBody>

				<PanelBody title={__('Preview', 'sensitive-image-block-wp')}>
					<Button 
						variant="secondary"
						onClick={() => setShowOverlayPreview(!showOverlayPreview)}
					>
						{showOverlayPreview ? __('Hide Overlay', 'sensitive-image-block-wp') : __('Show Overlay', 'sensitive-image-block-wp')}
					</Button>
				</PanelBody>
			</InspectorControls>

			{isLinkUIOpen && (
				<Popover
					position="bottom center"
					onClose={() => setIsLinkUIOpen(false)}
					focusOnMount={false}
				>
					<LinkControl
						value={linkValue}
						onChange={onSetHref}
						onClose={() => setIsLinkUIOpen(false)}
					/>
				</Popover>
			)}

			<div {...blockProps}>
				<div className="sensitive-image-container">
					<div className="sensitive-image-wrapper">
						{href ? (
							<a
								href={href}
								target={linkTarget}
								rel={rel}
								className={linkClass}
								onClick={(e) => e.preventDefault()} // Prevent navigation in editor
							>
								<img 
									src={imageUrl} 
									alt={imageAlt}
									className="sensitive-image"
									style={{
										filter: showOverlayPreview ? `blur(${blurIntensity}px)` : 'none'
									}}
								/>
							</a>
						) : (
							<img 
								src={imageUrl} 
								alt={imageAlt}
								className="sensitive-image"
								style={{
									filter: showOverlayPreview ? `blur(${blurIntensity}px)` : 'none'
								}}
							/>
						)}
						
						{showOverlayPreview && (
							<div 
								className="sensitive-image-overlay"
								style={{
									backgroundColor: overlayBackgroundColor,
									opacity: overlayOpacity
								}}
							>
								<div className="overlay-content">
									<div className="warning-text">{warningText}</div>
									<button 
										className="reveal-button"
										style={{
											backgroundColor: buttonBackgroundColor,
											color: buttonTextColor
										}}
										onClick={() => setShowOverlayPreview(false)}
									>
										{revealButtonText}
									</button>
								</div>
							</div>
						)}
						
						{!showOverlayPreview && (
							<button 
								className="hide-button visible"
								style={{
									backgroundColor: buttonBackgroundColor,
									color: buttonTextColor
								}}
								onClick={() => setShowOverlayPreview(true)}
							>
								{hideButtonText}
							</button>
						)}
					</div>

					{(caption || isSelected) && (
						<RichText
							tagName="figcaption"
							className="wp-element-caption"
							placeholder={__('Add caption...', 'sensitive-image-block-wp')}
							value={caption}
							onChange={(value) => setAttributes({ caption: value })}
							inlineToolbar
						/>
					)}
				</div>
			</div>
		</>
	);
}