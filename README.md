# Obsidian Pending Notes Plugin
[![GitHub release](https://img.shields.io/github/release/ulisesantana/obsidian-pending-notes.svg)](https://GitHub.com/ulisesantana/obsidian-pending-notes/releases/)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-pending-notes%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
[![codecov](https://codecov.io/github/ulisesantana/obsidian-pending-notes/branch/master/graph/badge.svg?token=XXwfgoPhoY)](https://codecov.io/github/ulisesantana/obsidian-pending-notes)

<a href="https://www.buymeacoffee.com/ulisesantana" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 42px !important;width: auto !important;" ></a>

This is a plugin for [Obsidian](https://obsidian.md).

Pending Notes aims to collect in one place all the links you have created on the fly while writing, but links to nowhere yet. With this plugin, you can create those notes easily.

![Show who the plugins can be used](docs/preview.gif)

You can use it from left sidebar or through the command palette:

![Command preview](docs/command.png)

## How to install

This plugin is an Obsidian Community Plugin, so you can **install it right from your Obsidian settings**. However, if you want you can install it manually in two ways: 

### Manual install: download release 
Go to [the latest release](https://github.com/ulisesantana/obsidian-pending-notes/releases/latest) and download the zip file that looks like `obsidian-pending-notes-X.X.X.zip`.

Once download is finished you can unzip it inside your vault on `.obsidian/plugins/`. If you are not doing this through your terminal or console, you may need to enable your file browser to show *hidden files*.

After that you can activate it on your Obsidian settings. If the plugin is not showed try to restart Obsidian.

### Manual install: build plugin
Go to `.obsidian/plugins/` and run:

```shell
$ git clone https://github.com/ulisesantana/obsidian-pending-notes.git
$ cd obsidian-pending-notes
$ npm run deploy
```

After that you can activate it on your Obsidian settings. If the plugin is not showed try to restart Obsidian.

**Note**: For build the plugin you will need installed git and [Node.js](https://nodejs.org/en/) at LTS version.

## Support 

If you find this plugin useful, you can support me [buying me a coffee](https://www.buymeacoffee.com/ulisesantana).
