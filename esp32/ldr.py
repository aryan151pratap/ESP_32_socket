from machine import ADC, Pin
from time import sleep

# Set up ADC on pin 34 (ADC1 channel 6 on ESP32)
ldr = ADC(Pin(34))      
ldr.atten(ADC.ATTN_11DB)  # Full range: 0-3.3V
ldr.width(ADC.WIDTH_10BIT)  # 10-bit resolution (0-1023)

while True:
    value = ldr.read()  # Read light level
    print("LDR Value:", value)
    sleep(0.5)
