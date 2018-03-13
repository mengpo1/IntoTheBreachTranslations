![](https://img.shields.io/badge/Game_Version-1.0.20(3--8--2018)-green.svg) 
![](https://img.shields.io/badge/DE__Alpha-Playable-orange.svg)
![](https://img.shields.io/badge/FR__Alpha-Playable-orange.svg)
# Into the Breach - Translations
Inofficial Translations for PC Game Into the Breach. This is all fan made. You can help translating this game into your language. If used, it does directly modify some game files.

Until now, a complete translation file for one language contains more than 2000 lines of text. When all keys are included it grows up to 4000+. A huge job that really take some time and that demands your stamina.

## General Status
* Text-file based translation keys are almost complete and ready for translation, except most of pilot texts are missing, which are about 2000 more extra long lines to go
* The fonts of the game don't support most of special chars in other languages, a fix is probably to modify the included game fonts
* Hardcoded image translations are not changable by this tool as it requires to modify images directly out of game resources

## Downloads
* German alpha: https://github.com/brainfoolong/IntoTheBreachTranslations/raw/master/packages/de.zip
* French alpha: https://github.com/brainfoolong/IntoTheBreachTranslations/raw/master/packages/fr.zip
* Other languages are missing contributors. Become one.

## How to install
1. Download a language pack from the download list
2. Find your game folder
3. Unpack all files/folders into the game folder. WARNING: This action does modify original game files. You must replace existing files. Better make a backup before doing this.

## How to contribute

1. Fork and clone repository
2. Open your target language file from `languages/xx.po` with PoEdit (https://poedit.net/)
3. Modify with PoEdit
4. Push changes via Pull Request to this repository

## How to create a new language base

1. Create an issue request if not yet exist
2. Additionaly: Open `languages/template.pot` with PoEdit and create your new language `.po` file in this directory

## How to test your translation
1. Do everything from "contribute"
2. Run `npm install` in the base directory of this repository
3. Change the file name from `dev/config.tpl.js` to `dev/config.js` and modify the config to your needs
4. Run `dev/create-language-packages.js` via NodeJS
5. Search the generated zipfile for your language in `packages` and follow the `How to install` section
6. Or: Modify `dev/config.js` to directly copy those files when executing `dev/create-language-packages.js`

## How does all this work in depth
This tools does work in 2 steps. First, it does directly parse all required game files, extract all translatable keys and create one big translatable `.pot` template file out of that. The `.pot` than can be edited by translators with free tools like PoEdit and will finally be saved to a `.po` file. The second step, to bring it back in game, is to parse the big `.po` file and assigning and replacing each translatable key to the correct game file and position. For this steps i have made 2 automated scripts that do all the work, namely `dev/create-template-pot.js` and `dev/create-language-packages.js`. This things do some magical stuff and will probably be just weird code for all non involved persons.

## Note
I've contacted the Developer SubsetGames. This project is ok for them, right now. But maybe things will change in the future. Thanks for being open to fan mods.

## Limitations
* No cyrillic support, many special chars not supported
* Not all texts can be translated, some are hardcoded
