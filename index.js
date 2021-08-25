const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = `<html><head></head><body>
    <div id="autoDust"></div>
    <div class="autoBattleBarHolder">
        <div id = 'autoBattleTrimpHealthBar'></div>
        <div id = 'autoBattleTrimpAttackBar'></div>
        <div id = 'autoBattleTrimpHealth'></div>
        <div id = 'autoBattleTrimpHealthMax'></div>
        <div id = 'autoBattleEnemyHealthBar'></div>
        <div id = 'autoBattleEnemyAttackBar'></div>
        <div id = 'autoBattleEnemyHealth'></div>
        <div id = 'autoBattleEnemyHealthMax'></div>
    </div>
</body></html>`;
const dom = new JSDOM(html);
const readline = require('readline');
let AB;
let startTime;
let formatter;

const start = () => {
    global.document = dom.window.document;
    global.lastTooltipTitle = 'AutoBattle';
    global.game = {
        global: {
            lockTooltip: true,
        },
        stats: {
            saKills: {},
            saDust: {},
        },
    };
    global.prettify = (x) => x;
    global.tooltip = (x) => x;
    global.swapClass = () => {};
    global.giveSingleAchieve = () => {};
    global.usingRealTimeOffline = false;
    global.getRandomIntSeeded = (seed, minIncl, maxExcl) => {
        var toReturn = Math.floor(seededRandom(seed) * (maxExcl - minIncl)) + minIncl;
        return (toReturn === maxExcl) ? minIncl : toReturn;
    }
    global.seededRandom = (seed) => {
        var x = Math.sin(seed++) * 10000;
        return parseFloat((x - Math.floor(x)).toFixed(7));
    }

    formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 });

    AB = require('./object.js');

    let iterations = 100;
    let farming = false;
    let battleTime = 0;

    AB.speed = 100;

    AB.enemyLevel = 45;
    AB.maxEnemyLevel = 59;
    AB.oneTimers.Master_of_Arms.owned = true;
    AB.oneTimers.Dusty_Tome.owned = true;
    AB.oneTimers.Whirlwind_of_Arms.owned = true;

    // Sword and Pants start out equipped by default, so we need to unequip them.
    AB.equip("Sword");
    AB.equip("Pants");

    let items_to_use = require('./items.json');

    AB.bonuses.Extra_Limbs.level = items_to_use.length - 4;
    console.log(items_to_use);
    items_to_use.forEach(x => {
        AB.items[x.n].level = x.l;
        AB.equip(x.n);
    });

    AB.update();

    let run = 0;
    startTime = Date.now();
    while (run++ < iterations) {
      AB.update();
    }
    wrapup();
}

const wrapup = () => {
    const endTime = Date.now();
    const time = endTime - startTime;
    console.log("Took " + time + " ms");
    console.log(AB.lootAvg.counter + " ms processed.");
    console.log(AB.sessionEnemiesKilled + " killed, ", AB.sessionTrimpsKilled + " died.");

    base_dust = AB.getDustPs();
    console.log("Base value: " + formatter.format(base_dust) + " dust per second");
}

start();
