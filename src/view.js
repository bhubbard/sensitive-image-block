/**
 * Frontend JavaScript for the Sensitive Image block
 * Handles overlay reveal/hide functionality with smooth transitions
 */

document.addEventListener('DOMContentLoaded', function() {
	const sensitiveImages = document.querySelectorAll('.wp-block-telex-sensitive-image');
	
	sensitiveImages.forEach(function(block) {
		const container = block.querySelector('.sensitive-image-container');
		const wrapper = block.querySelector('.sensitive-image-wrapper');
		const overlay = block.querySelector('.sensitive-image-overlay');
		const revealButton = block.querySelector('.reveal-button');
		const hideButton = block.querySelector('.hide-button');
		const image = block.querySelector('.sensitive-image');
		
		if (!container || !wrapper || !overlay || !revealButton || !hideButton || !image) {
			console.warn('Sensitive Image block: Missing required elements');
			return;
		}
		
		// Get blur intensity from data attribute or default to 10
		const blurIntensity = parseInt(block.dataset.blurIntensity) || 10;
		
		// Track reveal state
		let isRevealed = false;
		
		function initializeState() {
			// Apply initial blur to image
			image.style.filter = `blur(${blurIntensity}px)`;
			
			// Ensure overlay is visible and positioned correctly
			overlay.classList.remove('revealed');
			overlay.style.opacity = '1';
			overlay.style.visibility = 'visible';
			overlay.style.pointerEvents = 'auto';
			
			// Hide the hide button initially
			hideButton.classList.remove('visible');
			hideButton.style.opacity = '0';
			hideButton.style.visibility = 'hidden';
			
			isRevealed = false;
			console.log('Sensitive image initialized with blur:', blurIntensity + 'px');
		}
		
		function revealImage() {
			if (isRevealed) return;
			
			console.log('Revealing image');
			
			// Remove blur from image
			image.style.filter = 'blur(0px)';
			
			// Hide overlay with transition
			overlay.classList.add('revealed');
			overlay.style.opacity = '0';
			overlay.style.visibility = 'hidden';
			overlay.style.pointerEvents = 'none';
			
			// Show hide button after a short delay
			setTimeout(() => {
				hideButton.classList.add('visible');
				hideButton.style.opacity = '1';
				hideButton.style.visibility = 'visible';
			}, 200);
			
			isRevealed = true;
		}
		
		function hideImage() {
			if (!isRevealed) return;
			
			console.log('Hiding image');
			
			// Hide the hide button immediately
			hideButton.classList.remove('visible');
			hideButton.style.opacity = '0';
			hideButton.style.visibility = 'hidden';
			
			// Apply blur to image
			image.style.filter = `blur(${blurIntensity}px)`;
			
			// Show overlay
			overlay.classList.remove('revealed');
			overlay.style.opacity = '1';
			overlay.style.visibility = 'visible';
			overlay.style.pointerEvents = 'auto';
			
			isRevealed = false;
		}
		
		// Initialize the block state - overlay visible by default
		initializeState();
		
		// Event listeners
		revealButton.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			revealImage();
		});
		
		hideButton.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			hideImage();
		});
		
		// Allow clicking anywhere on overlay to reveal
		overlay.addEventListener('click', function(e) {
			// Only trigger if not clicking on the button directly
			if (!revealButton.contains(e.target)) {
				revealImage();
			}
		});
		
		// Keyboard accessibility
		revealButton.addEventListener('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				revealImage();
			}
		});
		
		hideButton.addEventListener('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				hideImage();
			}
		});
	});
});