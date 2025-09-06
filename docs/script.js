let wasmModule = null;
let phoneResponseFunction = null;

// Load the WASM module
async function loadWasm() {
    try {
        updateStatus('Loading WASM module...', 'info');
        
        // PhoneResponse should be available globally after loading phone_response.js
        if (typeof PhoneResponse === 'undefined') {
            throw new Error('PhoneResponse not found. Make sure phone_response.js is loaded properly.');
        }
        
        console.log('PhoneResponse type:', typeof PhoneResponse);
        console.log('PhoneResponse:', PhoneResponse);
        
        // Initialize the module
        wasmModule = await PhoneResponse({
            locateFile: (path) => {
                // Ensure correct path to WASM file
                if (path.endsWith('.wasm')) {
                    return './phone_response.wasm';
                }
                return path;
            }
        });
        
        console.log('WASM module initialized:', wasmModule);
        
        // Wrap the C function
        phoneResponseFunction = wasmModule.cwrap('phone_response', 'string', ['string']);
        
        console.log('Function wrapped:', typeof phoneResponseFunction);
        
        updateStatus('WASM module loaded successfully!', 'success');
        document.getElementById('generate-btn').disabled = false;
    } catch (error) {
        console.error('Failed to load WASM:', error);
        console.error('Error stack:', error.stack);
        updateStatus(`Failed to load WASM module: ${error.message}`, 'error');
        
        // Show helpful error message
        if (window.location.protocol === 'file:') {
            setTimeout(() => {
                updateStatus('Cannot load WASM from file://. Please use: python3 -m http.server 8000', 'error');
            }, 5000);  // Wait 5 seconds before showing file:// error
        }
    }
}

// Generate confirmation ID
function generateResponseCode() {
    const inputId = document.getElementById('input-id').value.trim();
    const responseCodeField = document.getElementById('response-code');
    const copyBtn = document.getElementById('copy-btn');
    
    if (!inputId) {
        updateStatus('Please enter an Input ID', 'error');
        return;
    }
    
    if (!phoneResponseFunction) {
        updateStatus('WASM module not loaded yet', 'error');
        return;
    }
    
    updateStatus('Generating...', 'info');
    
    try {
        const result = phoneResponseFunction(inputId);
        
        if (result.startsWith('ERROR:')) {
            updateStatus(result, 'error');
            responseCodeField.value = '';
            copyBtn.style.display = 'none';
        } else {
            responseCodeField.value = result;
            copyBtn.style.display = 'block';
            updateStatus('Response Code generated successfully!', 'success');
        }
    } catch (error) {
        console.error('Generation error:', error);
        updateStatus('Error generating Response Code', 'error');
        responseCodeField.value = '';
        copyBtn.style.display = 'none';
    }
}

// Copy to clipboard
async function copyToClipboard() {
    const responseCode = document.getElementById('response-code').value;
    
    try {
        await navigator.clipboard.writeText(responseCode);
        updateStatus('Copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.disabled = true;
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.disabled = false;
        }, 2000);
    } catch (error) {
        console.error('Copy failed:', error);
        updateStatus('Failed to copy to clipboard', 'error');
    }
}

// Update status message
function updateStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // Clear status after different times based on type
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'status';
        }, 8000);  // Success messages stay 8 seconds
    } else if (type === 'info') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'status';
        }, 6000);  // Info messages stay 6 seconds
    }
    // Error messages stay permanent until next action
}

// Format Input ID input
function formatInputId() {
    const input = document.getElementById('input-id');
    let value = input.value.replace(/[^0-9]/g, ''); // Remove non-digits
    
    // Add hyphens every 6 digits
    let formatted = '';
    for (let i = 0; i < value.length; i += 6) {
        if (i > 0) formatted += '-';
        formatted += value.substr(i, 6);
    }
    
    input.value = formatted;
}

// Allow Enter key to generate
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        generateResponseCode();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Disable generate button until WASM loads
    document.getElementById('generate-btn').disabled = true;
    updateStatus('Loading WASM module...', 'info');
    
    // Add event listeners
    document.getElementById('input-id').addEventListener('input', formatInputId);
    document.getElementById('input-id').addEventListener('keypress', handleKeyPress);
    
    // Load WASM module
    loadWasm();
});

// Handle WASM loading errors
window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('.wasm')) {
        updateStatus('Failed to load WASM file. Make sure all files are properly hosted.', 'error');
    }
});