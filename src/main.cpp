#include <Arduino.h>

#include <Keypad.h>
#include <LiquidCrystal.h>

// lcd init
LiquidCrystal lcd(14, 15, 16, 17, 18, 19);

// keypad init
const byte ROWS = 4;    // 행(rows) 개수
const byte COLS = 4;    // 열(columns) 개수
char keys[ROWS][COLS] = {
	{'1', '2', '3', 'A'},
	{'4', '5', '6', 'B'},
	{'7', '8', '9', 'C'},
	{'*', '0', '#', 'D'}
};

byte rowPins[ROWS] = {6, 7, 8, 9};   // R1, R2, R3, R4 단자가 연결된 아두이노 핀 번호
byte colPins[COLS] = {5, 4, 3, 2};   // C1, C2, C3, C4 단자가 연결된 아두이노 핀 번호

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );

enum {
	STATE_IDLE = 0,
	STATE_MAIN,
	STATE_INPUT_BOOKNUMBER,
	STATE_INPUT_NUMBER
};

int state = STATE_MAIN;
int len = 0;
char buf[14];

int main_menu(char key);
int input_number(char key);
int input_booknumber(char key);
bool getNumber(char key);
bool getBookNumber(char key);
void setLedRGB(int r, int g, int b);
void setLedRGB_Blink(int r, int g, int b, int n, int t);

void setup() {
	Serial.begin(9600);
	lcd.begin(16, 2);
	
	pinMode(10, OUTPUT);
	pinMode(11, OUTPUT);
	pinMode(12, OUTPUT);
	
	pinMode(13, OUTPUT);
}

void loop() {
	char key = keypad.getKey();
	int prev_state = state;
	
	switch (state) {
		case STATE_MAIN :
			state = main_menu(key);
			break;
		case STATE_INPUT_BOOKNUMBER:
			state = input_booknumber(key);
			break;
		case STATE_INPUT_NUMBER:
			state = input_number(key);
			break;
	}
	
	if (state == 0)
		state = prev_state;
	else if (prev_state != state)
		lcd.clear();
}

/***** state *****/
int main_menu(char key) {
	lcd.setCursor(0, 0);
	lcd.print("A. rent / B. return");
	lcd.setCursor(0, 1);
	lcd.print("C, find");
	
	setLedRGB(0, 255, 0);
	
	if (key == 'A') {
		Serial.println("rent");
		
		return STATE_INPUT_NUMBER;
	} else if (key == 'B') {
		Serial.println("return");
		
		return STATE_INPUT_NUMBER;
	} else if (key == 'C') {
		Serial.println("find");
		
		return STATE_INPUT_BOOKNUMBER;
	}
	
	return STATE_IDLE;
}

int input_number(char key) {
	setLedRGB(255, 127, 39);
	
	if (getNumber(key)) {
		Serial.println(buf);
		
		return STATE_INPUT_BOOKNUMBER;
	}
	
	return STATE_IDLE;
}

int input_booknumber(char key) {
	setLedRGB(255, 127, 39);
	
	if (getBookNumber(key)) {
		Serial.println(buf);
		
		return STATE_MAIN;
	}
	
	return STATE_IDLE;
}

/***** function *****/
bool getNumber(char key) {
	lcd.setCursor(0, 0);
	lcd.print("Number :");
	
	if (key >= '0' && key <= '9') {
		if (len < 10) {
			lcd.setCursor(len, 1);
			lcd.print(key);
			
			buf[len++] = key;
		}
	} else if (key == '*') {
		if (len == 8 || len == 10) {
			buf[len] = 0;
			len = 0;
			
			return true;
		}
		
		len = 0;
		digitalWrite(13, HIGH);
		setLedRGB_Blink(255, 0, 0, 2, 2000);
		digitalWrite(13, LOW);
		lcd.clear();
	} else if (key == '#') {
		buf[--len] = 0;
		
		lcd.setCursor(len, 1);
		lcd.print(" ");
	}
	
	return false;
}

bool getBookNumber(char key) {
	lcd.setCursor(0, 0);
	lcd.print("Book Number :");
	
	if (key >= '0' && key <= '9') {
		if (len < 13) {
			lcd.setCursor(len, 1);
			lcd.print(key);
			
			buf[len++] = key;
		}
	} else if (key == '*') {
		if (len == 13) {
			buf[len] = 0;
			len = 0;
			
			return true;
		}
		
		len = 0;
		digitalWrite(13, HIGH);
		setLedRGB_Blink(255, 0, 0, 2, 2000);
		digitalWrite(13, LOW);
		lcd.clear();
	} else if (key == '#') {
		buf[--len] = 0;
		
		lcd.setCursor(len, 1);
		lcd.print(" ");
	}
	
	return false;
}

void setLedRGB(int r, int g, int b) {
	analogWrite(10, r);
	analogWrite(11, g);
	analogWrite(12, b);
}

void setLedRGB_Blink(int r, int g, int b, int n, int t) {
	t = t / n / 2;
	
	for (int i = 0; i < n ; i++) {
		setLedRGB(r, g, b);
		delay(t);
		setLedRGB(0, 0, 0);
		delay(t);
	}
}