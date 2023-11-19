# Assets (SCOWL)

The assets used to generate the words for each list are taken from [SCOWL](http://wordlist.aspell.net/). Specifically
the `final` folder found within. The files in this folder as named as follows:

```
<spelling category>-<sub-category>.<size>
```

For this project we are using only files which are found in the sub-category `words`. The spelling category itself and size can be specified when running the cli command.

## Note ([SCOWL ReadMe](http://wordlist.aspell.net/scowl-readme/))

When manually combining the words lists the "english" spelling category should be used as well as one of "american", "british", "british_z" (british with ize spelling), "canadian" or "australian".

## Understanding sizes

Size 35 is the recommended small size, 50 the medium and 70 the large. Sizes 70 and below contain words found in most dictionaries while the 80 size contains all the strange and unusual words people like to use in word games such as Scrabble (TM). While a lot of the words in the 80 size are not used very often, they are all generally considered valid words in the English language. The 95 contains just about every English word in existence and then some. Many of the words at the 95 level will probably not be considered valid English words by most people.

For spell checking it is recommend to use size 60. The 70 size is reasonable for those wanting a larger list and don't mind a few errors. The 80 or larger sizes are not reasonable for spell checking.
