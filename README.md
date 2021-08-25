# Autobattle simulator

This copies the object.js file from the Trimps source and exposes its content as a module.

Then it iterates over the fight logic trying to simulate how much dust would be earned.

Put the items you want to use into items.json in a format like this:

    [
        { "n": "Rusty_Dagger", "l": 18 },
        { "n": "Lifegiving_Gem", "l": 16 },
        { "n": "Shock_and_Awl", "l": 13 },
    ]
