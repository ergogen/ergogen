# Ergogen

Ergogen is a keyboard generator that aims to provide a common configuration format to describe **ergonomic** 2D layouts, and generate automatic plates, cases, and (un-routed) PCBs for them.
The project grew out of (and is an integral part of) the [Absolem keyboard](https://zealot.hu/absolem), and shares its [Discord server](https://discord.gg/nbKcAZB) as well.

For usage and config information, please refer to the [docs](https://docs.ergogen.xyz).

# 32-Key Card Keyboard
This is a 32-key version of the "Card" keyboard, extended from Ben Vallack's [26-key Card keyboard](https://github.com/benvallack/ergogen/blob/master/input/config-card.yaml).
32 keys was chosen to have all alpha characters on a single layer. The goal of this keyboard is to be compact, while still not being overly reliant on layers. I inted to use the tap-dance feature in the ZMK firmware for a more intuitive way to get more keys without too many layers in the firmware.

## KiCad
I'm including kicad files in this repo as a way to backup the routing. I tried to make the routing clean, and checked the connctions using a multimeter. The reset button was placed on the underside of the PCB (left or right) to give the PCB a better shape. Unintended resets shouldn't be much of a problem, as the button is pretty hard to press in general.
[Kicad Link](https://www.kicad.org)

## Contributions
Feature ideas, documentation improvements, examples, tests, or pull requests welcome!
Get in touch [on Discord](https://discord.gg/nbKcAZB), and we can definitely find something you can help with, if you'd like to.
