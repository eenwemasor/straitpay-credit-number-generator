# Straitpay credit number generator accessment test

Foobar is a Python library for dealing with word pluralization.

## Installation

locally installed nodejs [v16]

```js
git clone git@github.com:eenwemasor/straitpay-credit-number-generator.git

cd straitpay-credit-number-generator

npm install

npm run dev:watch

//application will run on localhost:3000
```

## Usage

There are 2 routes exposed to genate new credit number and to validate an existing credit card number

```js
    Route:  "/api/credit/create"
    Method: POST
    sample response: {
        "card": "8348775527",
        "message": "Credit number generated successfully"
    }
```

```js
    Route:  "/api/credit/validate"
    Method: POST,
    body: {
        cardNumber: "string | required"
    }
    sample valid response: {
        "status": "Valid",
        "card": "3237255744",
        "message": "Card number is valid"
    }
    sample invalid response: {
        "status": "Invalid",
        "card": "3937255744",
        "message": "Card number is not valid"
    }
```