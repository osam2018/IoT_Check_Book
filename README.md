# IoT Check 책

## 프로젝트 설명
Check 책은 아두이노를 이용한 무인 책 대출/반납 시스템이다.
여기에 IoT를 접목하여 서버와 DB를 통한 다양한 서비스를 제공한다.

## 프로젝트 구현 내용
* 개발 환경
    * Arduino
        * keypad
        * lcd
        * RGB led
        * led
    * nodejs
        * express
        * body-parser
        * mongoose
        * serialport
    * mongodb

* 핵심 기능
    * Keypad를 이용한 군번, ISBN 입력 및 대출/반납 시스템
    * Server를 통한 군번, 책(ISBN) DB 조회
    * 웹을 통한 DB 관리(추가/제거)
    * 대출/반납 하고자 하는 책이 어느 책장에 있는지 알려주는 위치파악 시스템

## 팀 소개
신현수 (프로그래머)
* 서버
* 아두이노

