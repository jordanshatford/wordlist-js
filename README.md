<p align="center">
  <br />
  <img width="150" height="150" src="./dictionary.png" alt="Logo">
  <h1 align="center"><b>wordlist-js</b></h1>
  <div align="center">
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/Language-Typescript-%233178C6.svg?style=flat&logo=typescript" alt="Language: TypeScript">
    </a>
    <a href="https://www.npmjs.com/package/wordlist-js">
      <img src="https://img.shields.io/npm/v/wordlist-js" alt="NPM version">
    </a>
    <a href="https://www.npmjs.com/package/wordlist-js">
      <img src="https://img.shields.io/bundlephobia/min/wordlist-js" alt="NPM bundle size">
    </a>
    <a href="https://www.npmjs.com/package/wordlist-js">
      <img src="https://img.shields.io/npm/dw/wordlist-js" alt="NPM downloads">
    </a>
    <a href="https://github.com/jordanshatford/wordlist-js/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-black.svg?style=flat&logo=license" alt="License: MIT">
    </a>
  </div>
  <p align="center">
    Lists of filtered words from various English dialects.
    <br />
    <a href="https://www.npmjs.com/package/wordlist-js"><strong>www.npmjs.com/package/wordlist-js »</strong></a>
    <br />
    <br />
  </p>
</p>

wordlist-js provides lists of English words based on how common they are used. It also provides words for many English dialects.

## Available Words Lists
See the project [config](./wordlist.config.json) for information on dialects and frequencies generated. Alternatively see the [dist](./dist/) folder for type declaration files.

## SCOWL
This project and words lists are based on [SCOWL](http://wordlist.aspell.net/).

When manually combining the words lists the "english" spelling category should be used as well as one of "american", "british", "britishZ" (british with ize spelling), "canadian" or "australian".

Size 35 is the recommended small size, 50 the medium and 70 the large. Sizes 70 and below contain words found in most dictionaries while the 80 size contains all the strange and unusual words people like to use in word games such as Scrabble (TM). While a lot of the words in the 80 size are not used very often, they are all generally considered valid words in the English language. The 95 contains just about every English word in existence and then some. Many of the words at the 95 level will probably not be considered valid English words by most people.

For spell checking it is recommend to use size 60. The 70 size is reasonable for those wanting a larger list and don't mind a few errors. The 80 or larger sizes are not reasonable for spell checking.
