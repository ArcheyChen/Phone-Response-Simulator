# Phone Response Simulator

A cross-platform phone response simulator with both command-line and web interfaces.

## ⚠️ Disclaimer

This project's source code and algorithms were found online. I don't know what the original purpose was. For convenience and testing purposes, I've wrapped it into both command-line and web versions to make it easier for everyone to test and experiment with.

## 📁 Project Structure

```
phone_response_simulator/
├── src/                          # Source code
│   ├── phone_response_cmdline.c  # Command-line version
│   └── phone_response_wasm.c     # WebAssembly version
├── build/                        # Compiled binaries
│   ├── phone_response            # Linux/macOS executable
│   ├── phone_response.js         # WASM JavaScript wrapper
│   └── phone_response.wasm       # WebAssembly binary
├── docs/                         # Web application (GitHub Pages ready)
│   ├── index.html                # Main web interface
│   ├── style.css                 # Styling
│   ├── script.js                 # JavaScript logic
│   ├── phone_response.js         # WASM wrapper (copied from build/)
│   └── phone_response.wasm       # WASM binary (copied from build/)
├── scripts/                      # Build and utility scripts
│   ├── build_wasm.sh            # Build WebAssembly version
│   └── serve.sh                 # Local development server
├── Makefile                     # Build configuration
└── README.md                    # This file
```

## 🚀 Quick Start

### Command Line Version
```bash
# Build
make

# Test
make test

# Run with your Input ID
./build/phone_response "YOUR-INPUT-ID"
```

### Web Version
```bash
# Build WASM
make wasm

# Start local server
make serve

# Open http://localhost:8000
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `make` | Build command-line version |
| `make wasm` | Build WebAssembly version |
| `make serve` | Start development server |
| `make test` | Test with sample data |
| `make clean` | Clean build files |

## 🌐 Web Deployment

The `docs/` directory is ready for GitHub Pages:

1. Push to GitHub
2. Enable Pages in repository settings
3. Set source to `docs/` folder
4. Access at `https://username.github.io/repository-name/`

## 🔧 Requirements

- **Command-line**: GCC with C99 support
- **WebAssembly**: Emscripten SDK
- **Web server**: Python 3 (for development)

## 📄 License

Educational and research purposes only.