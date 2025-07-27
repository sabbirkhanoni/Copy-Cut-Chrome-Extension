// Content script for automatic Cust ID copying
(function() {
    'use strict';

    // Store selected Cust IDs
    window.selectedCustIds = [];
        // Assuming you already track selected Cust IDs
    const previewBox = document.getElementById('preview');
    const previewText = document.getElementById('previewText');

    // Add visual feedback styling
    function addCheckboxStyling() {
        const style = document.createElement('style');
        style.textContent = `
            .checkbox-id-extension-highlight {
                background-color: #e3f2fd !important;
                border-left: 3px solid #2196f3 !important;
            }
            .checkbox-id-extension-checkbox:checked {
                accent-color: #2196f3;
            }
        `;
        document.head.appendChild(style);
    }

    function updatePreview(selectedCustIds) {
    if (selectedCustIds.length > 0) {
        previewBox.style.display = 'block';
        previewText.textContent = selectedCustIds.join(' ');
    } else {
        previewBox.style.display = 'none';
    }
}

    // Get Cust ID from table row
    function getCustIdFromRow(checkbox) {
        const row = checkbox.closest('tr');
        if (!row) return null;

        // Skip if this is a header row or select-all checkbox
        if (checkbox.closest('th') || checkbox.id.includes('select-all') || checkbox.className.includes('select-all')) {
            return null;
        }

        const cells = row.querySelectorAll('td');
        
        // Look for Cust ID column (usually 2nd column, index 1)
        // Try different possible positions for Cust ID
        for (let i = 1; i < Math.min(cells.length, 4); i++) {
            const cellText = cells[i].textContent.trim();
            // Check if it looks like a Cust ID (numeric, reasonable length)
            if (/^\d{1,6}$/.test(cellText) && cellText.length >= 2) {
                return cellText;
            }
        }

        return null;
    }

    // Update clipboard with current selection
    function updateClipboard() {
        if (window.selectedCustIds.length > 0) {
            const formattedIds = window.selectedCustIds.join(' ');
            navigator.clipboard.writeText(formattedIds).then(() => {
                console.log('Auto-copied Cust IDs:', formattedIds);
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
            });
        } else {
            // Clear clipboard when no items selected
            navigator.clipboard.writeText('').catch(err => {
                console.error('Failed to clear clipboard:', err);
            });
        }
    }

    // Setup automatic checkbox handling
    function setupAutomaticCopying() {
        document.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                const custId = getCustIdFromRow(e.target);
                
                if (custId) {
                    const row = e.target.closest('tr');
                    
                    if (e.target.checked) {
                        // Add Cust ID if not already present
                        if (!window.selectedCustIds.includes(custId)) {
                            window.selectedCustIds.push(custId);
                        }
                        // Highlight row
                        if (row) {
                            row.classList.add('checkbox-id-extension-highlight');
                        }
                        showNotification(`Added Cust ID: ${custId}`, 'success');
                    } else {
                        // Remove Cust ID
                        const index = window.selectedCustIds.indexOf(custId);
                        if (index > -1) {
                            window.selectedCustIds.splice(index, 1);
                        }
                        // Remove highlight
                        if (row) {
                            row.classList.remove('checkbox-id-extension-highlight');
                        }
                        showNotification(`Removed Cust ID: ${custId}`, 'error');
                    }
                    
                    // Update clipboard immediately
                    updateClipboard();
                }
                
                e.target.classList.add('checkbox-id-extension-checkbox');
            }
        });
    }

    // Add keyboard shortcut for reset (Ctrl+Shift+R)
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                resetAllSelections();
            }
        });
    }

    // Reset all selections
    function resetAllSelections() {
        window.selectedCustIds = [];
        
        // Uncheck all checkboxes and remove highlights
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            if (getCustIdFromRow(checkbox)) { // Only uncheck data row checkboxes
                checkbox.checked = false;
                const row = checkbox.closest('tr');
                if (row) {
                    row.classList.remove('checkbox-id-extension-highlight');
                }
            }
        });
        
        // Clear clipboard
        navigator.clipboard.writeText('').then(() => {
            showNotification('🗑️ All selections cleared!', 'success');
        });
    }

    // Show modern notification
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.getElementById('checkbox-id-extension-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'checkbox-id-extension-notification';

        let backgroundColor;
        switch (type) {
            case 'success':
                backgroundColor = '#4CAF50'; // Green
                break;
            case 'error':
                backgroundColor = '#f44336'; // Red
                break;
            default:
                backgroundColor = '#2196F3'; // Blue
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px; /* Start off-screen */
            z-index: 10000;
            padding: 12px 20px;
            border-radius: 30px;
            color: #fff;
            background-color: ${backgroundColor};
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            transition: right 0.4s ease, opacity 0.3s ease;
            opacity: 1;
            max-width: 90%;
            min-width: 250px;
        `;

        // Add icon
        const icon = document.createElement('span');
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.width = '20px';
        icon.style.height = '20px';

        const iconSVGs = {
            success: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="20px" height="20px">
                    <path d="M9 16.2l-3.5-3.5L4 14l5 5 12-12-1.5-1.5z"/>
                </svg>
            `,
            error: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="20px" height="20px">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                    10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17
                    12 13.41 8.41 17 7 15.59 10.59 12 7 8.41
                    8.41 7 12 10.59 15.59 7 17 8.41 13.41 12
                    17 15.59z"/>
                </svg>
            `,
            info: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="20px" height="20px">
                    <path d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6zm1-15C6.48 2 2 6.48
                    2 12s4.48 10 10 10 10-4.48
                    10-10S17.52 2 12 2zm0 18c-4.41
                    0-8-3.59-8-8s3.59-8
                    8-8 8 3.59 8 8-3.59 8-8
                    8z"/>
                </svg>
            `
        };

        // Set the appropriate icon
        icon.innerHTML = iconSVGs[type] || iconSVGs['info'];
        notification.prepend(icon);

        // Add message
        const text = document.createElement('span');
        text.textContent = message;
        notification.appendChild(text);

        document.body.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.style.right = '20px';
        }, 50);

        // Fade out and slide away
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.right = '-400px';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        addCheckboxStyling();
        setupAutomaticCopying();
        setupKeyboardShortcut();
        
        // Optional initial notification
        // setTimeout(() => {
        //     showNotification('✨ Auto Cust ID Copier is active!', 'success');
        // }, 1000);
    }
})();
