# wordlist-js

## 2.0.0

### Major Changes

- breaking: update exports to specify filtered out lists ([`8142c376b79c153169692664df64a99532ee855e`](https://github.com/jordanshatford/wordlist-js/commit/8142c376b79c153169692664df64a99532ee855e))

### Minor Changes

- feat: better generation of filtered and filtered out words lists ([`07760920648bb0120ba3dc8d000f0fd3bb5b2fac`](https://github.com/jordanshatford/wordlist-js/commit/07760920648bb0120ba3dc8d000f0fd3bb5b2fac))

- feat: export lists of words unfiltered ([`2e915f21cc6b98c6d4f63237d123c230fb05f9c6`](https://github.com/jordanshatford/wordlist-js/commit/2e915f21cc6b98c6d4f63237d123c230fb05f9c6))

### Patch Changes

- fix: better handling of invalid dialects and frequencies when generating ([`acf0f4f24c30cbb04aa4ca6117e6047ab9e2f267`](https://github.com/jordanshatford/wordlist-js/commit/acf0f4f24c30cbb04aa4ca6117e6047ab9e2f267))

## 1.8.0

### Minor Changes

- feat: add helper function for generating array of elements export ([`56dd8fd`](https://github.com/jordanshatford/wordlist-js/commit/56dd8fd4be0bee567baf006d167e3f168cf40501))

- feat: generate list of all bad words for each dialect ([`293544c`](https://github.com/jordanshatford/wordlist-js/commit/293544c00380146be644003fe5c692a966064ee4))

- feat: use typescript compiler api to generate dist code ([`9d96a90`](https://github.com/jordanshatford/wordlist-js/commit/9d96a900c1a6f8721bd311abdff20cda7562a59f))

- feat: simplify words list processing ([`27c7923`](https://github.com/jordanshatford/wordlist-js/commit/27c7923f6501fab6a1623da1f7c4881075be7544))

## 1.7.1

### Patch Changes

- fix: properly export from each dialect causing breaking change ([`8152abf`](https://github.com/jordanshatford/wordlist-js/commit/8152abfeb896ff815c7daa7f0b943b3a4649f321))

## 1.7.0

### Minor Changes

- feat: store words lists as json and get rid of scowl (see [#96](https://github.com/jordanshatford/wordlist-js/issues/96)) ([`0af1303`](https://github.com/jordanshatford/wordlist-js/commit/0af130327d18acdd998adb081839c765d61a1ede))

- feat: simply checking if word is in bad word list ([`6854893`](https://github.com/jordanshatford/wordlist-js/commit/6854893eebebe4e54d4864f0613e14858ba645d9))

- feat: only filter out exact words listed instead of regexs ([`594abdc`](https://github.com/jordanshatford/wordlist-js/commit/594abdc619a907a8b524544bcdd04aa8e770e3ab))

- feat: export bad words separately (see [#92](https://github.com/jordanshatford/wordlist-js/issues/92)) ([`277f02c`](https://github.com/jordanshatford/wordlist-js/commit/277f02ccbbeb500cbbdb80343b997ddcccd46505))

- feat: use wordlist.config.json when generating build ([`822e247`](https://github.com/jordanshatford/wordlist-js/commit/822e247def5516fd76d3db086ae41f919e4421db))

- feat: replace bad-words with our own list (as it is unmaintained) ([`f050336`](https://github.com/jordanshatford/wordlist-js/commit/f050336d5b6d39b94f4d4194276c413149467314))

- feat: better bad word matching to cleanup many missed words ([`932aa75`](https://github.com/jordanshatford/wordlist-js/commit/932aa7525d4ed7876e71503d8eac35672a068eb2))

### Patch Changes

- fix: remove duplicates from bad words list ([`8e0fdae`](https://github.com/jordanshatford/wordlist-js/commit/8e0fdaec7ea1b24c000979f8bbd99e840bfbce43))

## 1.6.0

### Minor Changes

- feat: add release ci workflow using changesets ([`2c4ed28`](https://github.com/jordanshatford/wordlist-js/commit/2c4ed28572b073987e0f83b7b937d55c7fcaa7e4))

- feat: use pnpm instead of npm (see [#99](https://github.com/jordanshatford/wordlist-js/issues/99)) ([`11c5b7f`](https://github.com/jordanshatford/wordlist-js/commit/11c5b7f1707982d9551403ec286978e64e479430))

### Patch Changes

- chore: replace semantic-release with changesets ([`132bc64`](https://github.com/jordanshatford/wordlist-js/commit/132bc64d4a1b7d320006089c93202744636c767b))
