import { Validator } from "node-input-validator";

class CreditController {
  CREDIT_CARD_MAX_LENGTH = 10;

  create(req, res) {
    let creditCardDigits = [];
    let creditCardValidationDigits = [];

    let { creditCardNumbers, creditCardValidityCheckDigits } =
      this.getCreditCardNumber();
    creditCardDigits = creditCardNumbers;
    creditCardValidationDigits = creditCardValidityCheckDigits;

    let cardSum = creditCardValidationDigits.reduce(
      (partialSum, a) => partialSum + a,
      0
    );

    while (cardSum % 10 !== 0) {
      let { creditCardNumbers, creditCardValidityCheckDigits } =
        this.getCreditCardNumber();

      creditCardDigits = creditCardNumbers;
      creditCardValidationDigits = creditCardValidityCheckDigits;

      cardSum = creditCardValidationDigits.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
    }

    return {
      response: {
        card: creditCardDigits.join(""),
        message: "Credit number generated successfully",
      },
      status: 200,
    };
  }

  getCreditCardNumber() {
    let creditCardNumbers = [];
    let creditCardValidityCheckDigits = [];

    for (let i = 0; i < this.CREDIT_CARD_MAX_LENGTH; i++) {
      const evenIndex = i % 2 == 0;

      let validatedDigit = null;
      let validateDigit = null;

      while (validatedDigit > 9 || !validatedDigit) {
        let { cardDigit, validationDigit } = this.generateValidCardDigit(evenIndex);
        validatedDigit = cardDigit;
        validateDigit = validationDigit;
      }
      creditCardNumbers.push(validatedDigit);
      creditCardValidityCheckDigits.push(validateDigit);
    }

    return { creditCardNumbers, creditCardValidityCheckDigits };
  }

  generateValidCardDigit(digitIndex) {
    const cardDigit = this.getRandomInt(0, 9);
    if (!digitIndex) {
      const doubledDigit = cardDigit * 2;

      if (doubledDigit > 9) {
        const doubledDigitSplitted = doubledDigit.toString().split("");

        const doubledDigitSum =
          parseInt(doubledDigitSplitted[0]) + parseInt(doubledDigitSplitted[1]);

        if (doubledDigitSum > 9) {
          return { cardDigit: doubledDigitSum, validationDigit: doubledDigitSum };
        } else {
          return { cardDigit, validationDigit: doubledDigitSum };
        }
      } else {
        return { cardDigit, validationDigit: doubledDigit };
      }
    } else {
      return { cardDigit, validationDigit: cardDigit };
    }
  }

  validateCardDigit(digitIndex, cardDigit) {
    if (!digitIndex) {
      const doubledDigit = cardDigit * 2;

      if (doubledDigit > 9) {
        const doubledDigitSplitted = doubledDigit.toString().split("");
        return (
          parseInt(doubledDigitSplitted[0]) + parseInt(doubledDigitSplitted[1])
        );
      } else {
        return doubledDigit;
      }
    } else {
      return cardDigit;
    }
  }

  async validate(req, res) {
    const v = new Validator(req.body, { cardNumber: "required|integer" });
    const message = "Card number is not valid";

    let validInput = await v.check();
    if (!validInput) {
      return { response: v.errors, status: 422 };
    }

    let creditCard = [];
    let cardNumber = req.body.cardNumber.split("");

    if (cardNumber.length > this.CREDIT_CARD_MAX_LENGTH) {
      return {
        response: {
          status: "Invalid",
          card: req.body.cardNumber,
          message,
        },
        status: 200,
      };
    }

    for (let i = 0; i < cardNumber.length; i++) {
      let cardDigit = parseInt(cardNumber[i]);

      const evenIndex = i % 2 == 0;

      let validatedDigit = this.validateCardDigit(evenIndex, cardDigit);

      creditCard.push(validatedDigit);
    }

    let cardSum = creditCard.reduce((partialSum, a) => partialSum + a, 0);

    if (cardSum % 10 == 0) {
      return {
        response: {
          status: "Valid",
          card: req.body.cardNumber,
          message: "Card number is valid",
        },
      };
    } else {
      return {
        response: {
          status: "Invalid",
          card: req.body.cardNumber,
          message,
        },
        status: 200,
      };
    }
  }

  getRandomInt(min = 0, max = 99) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}

module.exports = new CreditController();
