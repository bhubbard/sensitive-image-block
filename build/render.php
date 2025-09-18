<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Extract attributes
$image_id = $attributes['imageId'] ?? null;
$image_url = $attributes['imageUrl'] ?? '';
$image_alt = $attributes['imageAlt'] ?? '';
$caption = $attributes['caption'] ?? '';
$href = $attributes['href'] ?? '';
$link_target = $attributes['linkTarget'] ?? '';
$rel = $attributes['rel'] ?? '';
$link_class = $attributes['linkClass'] ?? '';
$warning_text = $attributes['warningText'] ?? __('This image may contain sensitive content', 'sensitive-image-block-wp');
$reveal_button_text = $attributes['revealButtonText'] ?? __('Show Image', 'sensitive-image-block-wp');
$hide_button_text = $attributes['hideButtonText'] ?? __('Hide Image', 'sensitive-image-block-wp');
$overlay_bg_color = $attributes['overlayBackgroundColor'] ?? '#000000';
$overlay_opacity = $attributes['overlayOpacity'] ?? 0.8;
$blur_intensity = $attributes['blurIntensity'] ?? 10;
$button_bg_color = $attributes['buttonBackgroundColor'] ?? '#ffffff';
$button_text_color = $attributes['buttonTextColor'] ?? '#000000';

// If no image, don't render
if (!$image_url) {
    return '';
}

// Convert hex to rgba for overlay background
if (!function_exists('sensitive_image_hex_to_rgba')) {
    function sensitive_image_hex_to_rgba($hex, $alpha = 1) {
        $hex = str_replace('#', '', $hex);
        if (strlen($hex) == 3) {
            $hex = str_repeat(substr($hex, 0, 1), 2) . str_repeat(substr($hex, 1, 1), 2) . str_repeat(substr($hex, 2, 1), 2);
        }
        $rgb = array_map('hexdec', str_split($hex, 2));
        return 'rgba(' . implode(', ', $rgb) . ', ' . $alpha . ')';
    }
}

$overlay_bg_rgba = sensitive_image_hex_to_rgba($overlay_bg_color, $overlay_opacity);

// Get block wrapper attributes with blur intensity data
$wrapper_attributes = get_block_wrapper_attributes([
    'data-blur-intensity' => $blur_intensity,
    'class' => 'wp-block-telex-sensitive-image'
]);

// Build link attributes if href exists
$link_attributes = '';
if ($href) {
    $link_attributes = sprintf(
        'href="%s"%s%s%s',
        esc_url($href),
        $link_target ? ' target="' . esc_attr($link_target) . '"' : '',
        $rel ? ' rel="' . esc_attr($rel) . '"' : '',
        $link_class ? ' class="' . esc_attr($link_class) . '"' : ''
    );
}

// Unique ID for accessibility
$unique_id = 'sensitive-image-' . wp_rand(1000, 9999);

?>
<div <?php echo $wrapper_attributes; ?>>
    <div class="sensitive-image-container">
        <div class="sensitive-image-wrapper">
            <?php if ($href) : ?>
                <a <?php echo $link_attributes; ?>>
                    <img 
                        src="<?php echo esc_url($image_url); ?>" 
                        alt="<?php echo esc_attr($image_alt); ?>"
                        class="sensitive-image"
                        loading="lazy"
                        style="filter: blur(<?php echo intval($blur_intensity); ?>px);"
                    />
                </a>
            <?php else : ?>
                <img 
                    src="<?php echo esc_url($image_url); ?>" 
                    alt="<?php echo esc_attr($image_alt); ?>"
                    class="sensitive-image"
                    loading="lazy"
                    style="filter: blur(<?php echo intval($blur_intensity); ?>px);"
                />
            <?php endif; ?>
            
            <div 
                class="sensitive-image-overlay"
                style="background-color: <?php echo esc_attr($overlay_bg_rgba); ?>;"
                role="dialog"
                aria-labelledby="warning-text-<?php echo esc_attr($unique_id); ?>"
                aria-describedby="warning-desc-<?php echo esc_attr($unique_id); ?>"
            >
                <div class="overlay-content">
                    <div 
                        id="warning-text-<?php echo esc_attr($unique_id); ?>" 
                        class="warning-text"
                    >
                        <?php echo esc_html($warning_text); ?>
                    </div>
                    <button 
                        class="reveal-button"
                        style="background-color: <?php echo esc_attr($button_bg_color); ?>; color: <?php echo esc_attr($button_text_color); ?>;"
                        aria-describedby="warning-desc-<?php echo esc_attr($unique_id); ?>"
                        type="button"
                    >
                        <?php echo esc_html($reveal_button_text); ?>
                    </button>
                    <div 
                        id="warning-desc-<?php echo esc_attr($unique_id); ?>" 
                        class="screen-reader-text"
                    >
                        <?php esc_html_e('Click to reveal the sensitive image content', 'sensitive-image-block-wp'); ?>
                    </div>
                </div>
            </div>
            
            <button 
                class="hide-button"
                style="background-color: <?php echo esc_attr($button_bg_color); ?>; color: <?php echo esc_attr($button_text_color); ?>;"
                aria-label="<?php esc_attr_e('Hide sensitive image', 'sensitive-image-block-wp'); ?>"
                type="button"
            >
                <?php echo esc_html($hide_button_text); ?>
            </button>
        </div>
        
        <?php if ($caption) : ?>
            <figcaption class="wp-element-caption">
                <?php echo wp_kses_post($caption); ?>
            </figcaption>
        <?php endif; ?>
    </div>
</div>