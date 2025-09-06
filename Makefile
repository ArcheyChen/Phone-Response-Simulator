CC = gcc
CFLAGS = -std=c99 -O2 -Wall
LDFLAGS =

TARGET = build/phone_response
SOURCE = src/phone_response_cmdline.c

.PHONY: all clean wasm serve

all: $(TARGET)

$(TARGET): $(SOURCE)
	mkdir -p build
	$(CC) $(CFLAGS) $(SOURCE) -o $(TARGET) $(LDFLAGS)

wasm:
	./scripts/build_wasm.sh

serve:
	./scripts/serve.sh

clean:
	rm -rf build/
	rm -f docs/phone_response.js docs/phone_response.wasm

install: $(TARGET)
	@echo "Built $(TARGET) successfully"
	@echo "Usage: ./$(TARGET) \"<input_id>\""

test: $(TARGET)
	@echo "Testing with sample Input ID..."
	./$(TARGET) "298011-913686-508043-363303-233555-258502-178954-424100-254921"