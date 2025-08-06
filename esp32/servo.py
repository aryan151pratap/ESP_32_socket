from machine import Pin, PWM
from time import sleep

# Set up PWM on pin 14 with 50Hz frequency (standard for servos)
servo = PWM(Pin(14), freq=50)

def set_angle(angle):
    # angle between 0 and 180
    # duty range for 0 to 180 degrees typically between 40 - 115 (adjust as needed)
    duty = int((angle / 180) * 75 + 40)
    servo.duty(duty)

while True:
    print("0 degrees")
    set_angle(0)
    sleep(1)

    print("90 degrees")
    set_angle(90)
    sleep(1)

    print("180 degrees")
    set_angle(180)
    sleep(1)
