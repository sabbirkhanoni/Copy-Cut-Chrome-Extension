document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('resetClipboard');
    const statusDiv = document.getElementById('status');
    const previewDiv = document.getElementById('preview');
    const previewText = document.getElementById('previewText');

    // Reset clipboard button
    resetButton.addEventListener('click', async function() {
        try {
            // Clear clipboard
            await navigator.clipboard.writeText('');
            
            // Get the active tab and clear the stored IDs
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                function: clearStoredIds
            });
            
            showStatus('Clipboard cleared successfully!', 'success');
            hidePreview();
            
        } catch (error) {
            console.error('Error clearing clipboard:', error);
            showStatus('Error clearing clipboard', 'error');
        }
    });

    // Check for current selection when popup opens
    loadCurrentSelection();

    async function loadCurrentSelection() {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            const results = await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                function: getCurrentSelectedIds
            });
            
            const currentIds = results[0].result;
            
            if (currentIds.length > 0) {
                const formattedIds = currentIds.join(' ');
                showStatus(`${currentIds.length} Cust ID(s) currently selected`, 'success');
                showPreview(formattedIds);
            }
            
        } catch (error) {
            console.error('Error loading current selection:', error);
        }
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        
        // Hide status after 3 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.textContent = 'Auto-copy is active. Select checkboxes to copy Cust IDs.';
                statusDiv.className = 'status info';
            }, 3000);
        }
    }

    function showPreview(text) {
        previewText.textContent = text;
        previewDiv.style.display = 'block';
    }

    function hidePreview() {
        previewDiv.style.display = 'none';
    }
});

// Function to clear stored IDs
function clearStoredIds() {
    window.selectedCustIds = [];
    // Also uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        // Skip the "select all" checkbox
        if (!checkbox.closest('th') && !checkbox.id.includes('select-all') && !checkbox.className.includes('select-all')) {
            checkbox.checked = false;
            // Remove highlight
            const row = checkbox.closest('tr');
            if (row) {
                row.classList.remove('checkbox-id-extension-highlight');
            }
        }
    });
}

// Function to get currently selected Cust IDs
function getCurrentSelectedIds() {
    if (!window.selectedCustIds) {
        window.selectedCustIds = [];
    }
    return window.selectedCustIds;
}