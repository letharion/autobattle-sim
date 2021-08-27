# Autobattle simulator

This copies the object.js file from the Trimps source and exposes its content as a module.

Then it iterates over the fight logic trying to simulate how much dust would be earned.

Put the items you want to use into items.json in a format like this:

    {
        "enemyLevel": 45,
        "maxEnemyLevel": 59,
        "oneTimers": [
            "Master_of_Arms",
            "Dusty_Tome",
            "Whirlwind_of_Arms"
        ],
        "items": [
            { "n": "Battery_Stick", "l": 18 },
            { "n": "Raincoat", "l": 15 },
            { "n": "Lifegiving_Gem", "l": 16 },
            { "n": "Shock_and_Awl", "l": 13 },
            { "n": "Spiked_Gloves", "l": 12 },
            { "n": "Bloodstained_Gloves", "l": 14 },
            { "n": "Big_Cleaver", "l": 11 },
            { "n": "Sacrificial_Shank", "l": 12 },
            { "n": "Grounded_Crown", "l": 6 },
            { "n": "Fearsome_Piercer", "l": 5 }
        ]
    }
