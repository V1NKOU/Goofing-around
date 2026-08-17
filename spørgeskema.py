#FIRST THING I MADE!
import os
os.system("cls")
import time
import random
print("hej med dig... vil du spille et spil?")
svar = input().lower()
time.sleep(1)
if svar in ["yes", "ok", "ja", "yuh"]:
    print("yayyy!")
else:
    print("damn")
    exit()
time.sleep(1.5)
#SPØRGSMÅL 1
print("ok så emmm..")
time.sleep(1.5)
print("hvad hedder én af mine 3 goats?")
svar = input().lower()
time.sleep(1)
if svar in ["guts", "gutsyboy", "gutsywutsy", "luffy", "monkeydluffy", "monkey d luffy", "goatjo", "gojo"]:
    print("KORREKT!!!")
    point = 1
else:
    print("FORKERT...")
    point = 0
time.sleep(1.5)
print("Point: " + str(point))
time.sleep(1.5)
#SPØRGSMÅL 2
print("er jeg sej?")
svar = input().lower()
time.sleep(1)
if svar in ["ja", "selvfølgelig", "yuh"]:
    print("KORREKT!!!")
    point += 1
else:
    print("FORKERT...")
time.sleep(1.5)
print("Point: " + str(point))
time.sleep(2)
print("Nu bliver det lidt anerledes..")
time.sleep(2)
print("hvad er 2+2")
time.sleep(2)
print("a. 4")
print("b. 5")
print("c. 22")
svar = input().lower()
time.sleep(1.5)
if svar == "a":
    print("KORREKT!!!")
    point += 1
else:
    print("FORKERT!!!")
time.sleep(1.5)
print("Point: " + str(point))
time.sleep(2)
#ENDE
print("hmm, det var alle de spørgssmål jeg havde for nu..")
time.sleep(2.5)
print("lad os se hvordan du klarede det :)")
time.sleep(2)
print(str(point) + " point hva..?")
time.sleep(2.5)
if point <= 0:
    print("FUCK DU LORT💀😭")
else:
    print("GODT KLARET!!🤑")
time.sleep(2)