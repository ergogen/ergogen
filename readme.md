# Ergogen

Ergogen is a keyboard generator that aims to provide a common configuration format to describe **ergonomic** 2D layouts, and generate automatic plates, cases, and (un-routed) PCBs for them.
The project grew out of (and is an integral part of) the [Absolem keyboard](https://zealot.hu/absolem), and shares its [Discord server](https://discord.gg/nbKcAZB) as well.






## Usage

Supposing you have a config ready, you can use ergogen either on the command line, or through the [web UI](https://zealot.hu/ergogen/).

Command line usage requires `node v14.4.0+` with `npm v6.14.5+` to be installed, the repo to be checked out, `npm install` to be issued, and then simply calling the CLI interface through `node src/cli.js`.
The `--help` switch lists the available command line options.

The [web UI](https://zealot.hu/ergogen/) is a more accessible version of the same codebase, where everything happens in your browser.
It's been patched together on a fresh Chrome-derivative, and I didn't take any care to make it compatible with older stuff, so please use something modern!

As for how to prepare a valid config, please read the [reference](https://github.com/mrzealot/ergogen/blob/master/docs/reference.md), or browse the [`docs`](https://github.com/mrzealot/ergogen/tree/master/docs) folder for additional examples.





## Contributions

Feature ideas, documentation improvements, examples, tests, or pull requests welcome!
Get in touch [on Discord](https://discord.gg/nbKcAZB), and we can definitely find something you can help with, if you'd like to.
