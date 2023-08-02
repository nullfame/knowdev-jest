# KnowDev Jest Extensions 🃏

## 📋 Usage

``` bash
npm install --save @knowdev/jest
```

### jest.config.js

``` javascript
module.exports = {
  setupFilesAfterEnv: ["jest-extended", "@knowdev/jest"],
};
```

## 📖 Reference

### toBeAsyncIterator()

Checks that a special symbol, `subject[Symbol.asyncIterator]`, exists and is a function.  Does not exercise iterator

``` javascript
expect(subject).toBeAsyncIterator();
```

### toBeClass()

Attempts to instantiate `subject`

``` javascript
expect(subject).toBeClass();
```

### toBeCalledWithInitialParams()

Unlike `toHaveBeenCalledWith()`, which matches the entire set of parameters, `toBeCalledWithInitialParams()` only matches the first `n` parameters.  E.g., if you want to test only the first parameter

``` javascript
# Passes:
mockFunction(1, 2, 3);
expect(mockFunction).toBeCalledWithInitialParams(1, 2);

# Fails:
mockFunction(1);
expect(mockFunction).toBeCalledWithInitialParams(1, 2);
```

### toThrowProjectError(), toThrowProjectErrorAsync()

Checks that the thrown error is an instance of `ProjectError`. 
Can be called with any of the following matchers, which much all match:

* String (matches as a substring)
* RegExp
* ProjectError class

``` javascript
expect(() => functionCall(...params)).toThrowProjectError();

expect(() => functionCall(...params)).toThrowProjectError(InternalError, "Internal Application", /internal application/i);
```

## 🚀 Deployment

`npm run publish`

## 📝 Changelog

* 1.0.2: Split `toThrowProjectError()` into sync and `totoThrowProjectErrorAsync()` versions
* 1.0.1: `toThrowProjectError()` supports async functions
* 1.0.0: arbitrary starting point
* 0.4.0: adds `toThrowProjectError()` (unpublished)
* 0.3.0: adds `toBeAsyncIterator()`
* 0.2.0: adds `toBeCalledWithInitialParams()`
* 0.1.0: adds `toBeClass()`

## 🛣 Roadmap

N/A

### Wishlist 🌠

N/A

## 📜 License

All rights reserved. Safe for use around pets.
