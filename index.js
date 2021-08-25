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
let run;
let iterations;
let startTime;
let formatter;
let items_to_use;

console.log("Starting");

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
    global.sendEvent = event => {
        if ("Trimp died" === event || "Enemy died" === event) {
            if ("Trimp died" === event) {
                deathCount++;
                // If we can't win, go back to farming.
                if (deathCount > 10) {
                    farming = true;
                    AB.levelDown();
                }
            }
            else {
                deathCount = 0;
            }
            //doAllUpgrade();
            //       console.log(event);
        }
    }
    global.getRandomIntSeeded = (seed, minIncl, maxExcl) => {
        var toReturn = Math.floor(seededRandom(seed) * (maxExcl - minIncl)) + minIncl;
        return (toReturn === maxExcl) ? minIncl : toReturn;
    }
    global.seededRandom = (seed) => {
        var x = Math.sin(seed++) * 10000;
        return parseFloat((x - Math.floor(x)).toFixed(7));
    }

    formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 });

    doAllUpgrade = () => {
        items_to_use.forEach(x => AB.upgrade(x));
    }

    //console.log(document.getElementById('autoBattleTrimpHealthBar'));
    //console.log(document.body.parentElement.innerHTML);
    AB = require('./object.js');

    let deathCount = 0;
    iterations = 100;
    let farming = false;
    let battleTime = 0;

    AB.speed = 100;
    AB.update();
    AB.enemy.level = 29;
    AB.oneTimers.Master_of_Arms.owned = true;

    items_to_use = [
        //{ n: 'Rusty_Dagger', l: 4 },
        { n: 'Battery_Stick', l: 11 },
        { n: 'Raincoat', l: 10 },
        //{ n: 'Bad_Medkit', l: 3 },
        //{ n: 'Chemistry_Set', l: 10 },
        { n: 'Lifegiving_Gem', l: 10 },
        //    { n: 'Spiked_Gloves', l: 4},
        { n: 'Shock_and_Awl', l: 7 },
        { n: 'Lich_Wraps', l: 6 },
        //    { n: 'Aegis', l: 2},
        //    { n: 'Sword_and_Board', l: 3 },
        { n: 'Bloodstained_Gloves', l: 6 },
        //{ n: 'Wired_Wristguards', l: 6 },
        //{ n: 'Eelimp_in_a_Bottle', l: 4 },
        //{ n: 'Sacrificial_Shank', l: 5 },
        { n: 'Big_Cleaver', l: 3 },
        //{ n: 'Plague_Bringer', l: 2 },
        //{ n: 'Very_Large_Slime', l: 2 },
        { n: 'Monkimp_Paw', l: 2 },
    ];
    AB.bonuses.Extra_Limbs.level = items_to_use.length - 5;
    items_to_use.forEach(x => {
        AB.items[x.n].level = x.l;
        AB.equip(x.n);
    });

    run = 0;
    startTime = Date.now();
    simulate();
}

const simulate = () => {
    AB.update();
    if (run++ < iterations) {
        setTimeout(simulate, 300);
    }
    else {
        wrapup();
    }
}
const wrapup = () => {
    const endTime = Date.now();
    const time = endTime - startTime;
    console.log("Took " + time + " ms");

    base_dust = AB.getDustPs() * 20000;
    console.log(AB.lootAvg.accumulator);
    console.log("Base value: " + formatter.format(base_dust) + " dust per second");
}

/*items_to_use.forEach(x => {
    upgradeCost = AB.upgradeCost(x.n);
    AB.items[x.n].level += 1;
    run = 0;

    simulate();

    x.newDust = AB.getDustPs();
    console.log("With 1 more level in " + x.n + ": " + formatter.format(x.newDust) + " at a cost of " + upgradeCost);
    console.log(formatter.format(upgradeCost / (x.newDust - base_dust)) + " dust cost per % dust gain increase");
    AB.items[x.n].level -= 1;
});*/

setTimeout(start, 7);
