#!/bin/bash

# Check if emscripten is available
if ! command -v emcc &> /dev/null; then
    echo "Emscripten not found. Please install it first:"
    echo "git clone https://github.com/emscripten-core/emsdk.git"
    echo "cd emsdk"
    echo "./emsdk install latest"
    echo "./emsdk activate latest"
    echo "source ./emsdk_env.sh"
    exit 1
fi

echo "Building WASM module..."

# Create build directory if it doesn't exist
mkdir -p build

emcc src/phone_response_wasm.c \
    -o build/phone_response.js \
    -s EXPORTED_FUNCTIONS='["_phone_response", "_malloc", "_free"]' \
    -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "UTF8ToString", "stringToUTF8", "lengthBytesUTF8"]' \
    -s MODULARIZE=1 \
    -s EXPORT_NAME='PhoneResponse' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -O3

# Copy WASM files to docs directory for web deployment
echo "Copying WASM files to docs directory..."
cp build/phone_response.js docs/
cp build/phone_response.wasm docs/

echo "WASM build complete!"
echo "Files generated:"
echo "  - build/phone_response.js"
echo "  - build/phone_response.wasm"
echo "  - docs/phone_response.js (for web)"
echo "  - docs/phone_response.wasm (for web)"