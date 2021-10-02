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

## 🚀 Deployment

`npm run publish`

## 📝 Changelog

* 0.2.0: adds `toBeCalledWithInitialParams()`
* 0.1.0: adds `toBeClass()`

## 🛣 Roadmap

N/A

### Wishlist 🌠

N/A

## 📜 License

All rights reserved. Safe for use around pets.
