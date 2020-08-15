# How does one use rewire and test using Jest

These are just my notes how to use [rewire] and [SinonJS] and create tests with
[Jest].

The main thing is in the [test file].

## Preparations

Run `yarn install`

## Running the tests

Run `yarn test` or `yarn test --watch`

## Running the "production" service

This should not be very interesting, but it goes like this: `yarn start`


[rewire]: https://github.com/jhnns/rewire
[SinonJS]: https://sinonjs.org/
[Jest]: https://jestjs.io/en/
[test file]: ./src/production-module.test.js
