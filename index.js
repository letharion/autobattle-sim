const jsdom = require('jsdom');
const { program } = require('commander');
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

program
  .option('-v56, --version56', 'Runs the simulation with version 5.6 of Trimps. This option will dropped once 5.6 is stable and released.')
program.parse(process.argv);
const options = program.opts();

let AB;
let startTime;
let formatter;
let buildCost;

const prettify = num => {
  return num.toLocaleString('en-US', {maximumSignificantDigits: 4, notation: 'compact', compactDisplay: 'short'})
}

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

    if (options.version56) {
        console.log("A");
        AB = require('./object56.js');
        console.log(AB);
    }
    else {
        AB = require('./object.js');
    }

    let iterations = 100;
    let farming = false;
    let battleTime = 0;

    AB.speed = 100;

    // Sword and Pants start out equipped by default, so we need to unequip them.
    AB.equip("Sword");
    AB.equip("Pants");

    let settings = require('./items.json');
    let items_to_use = settings.items;
    settings.oneTimers.forEach(n => AB.oneTimers[n].owned = true)
    AB.enemyLevel = settings.enemyLevel;
    AB.maxEnemyLevel = settings.maxEnemyLevel;

    AB.bonuses.Extra_Limbs.level = items_to_use.length - 4;
    console.log(items_to_use);
    buildCost = 0;
    items_to_use.forEach(x => {
        AB.items[x.n].level = x.l;
        AB.equip(x.n);
        let curCost = 5;
        if (AB.items[x.n].startPrice) curCost = AB.items[x.n].startPrice;
        let priceMod = 3;
        if (AB.items[x.n].priceMod) priceMod = AB.items[x.n].priceMod;
        let mycost = 0;
        for (let step = 0; step < x.l - 1; step++) {
          mycost += curCost;
          curCost *= priceMod;
        }
        console.log(x.n + " lv " + x.l + " -> " + prettify(mycost));
        buildCost += mycost;
    });
    console.log("Total cost =", prettify(buildCost));

    console.log("Starting simulation");
    AB.update();

    let run = 0;
    startTime = Date.now();
    while (run++ < iterations) {
      AB.update();
    }
    wrapup();
}

const enemyCount = (level) => {
    if (level < 20) return 10 * level;
    return 190 + (15 * (level - 19));
}

const wrapup = () => {
    const endTime = Date.now();
    const time = endTime - startTime;
    const WR = AB.sessionEnemiesKilled / (AB.sessionEnemiesKilled + AB.sessionTrimpsKilled);
    const toKill = enemyCount(AB.enemyLevel);
    const base_dust = AB.getDustPs();

    console.log("Took " + time + " ms");
    console.log(AB.lootAvg.counter + " ms processed.");
    console.log(AB.sessionEnemiesKilled + " killed,", AB.sessionTrimpsKilled + " died. [" + prettify(100 * WR) + "%]");
    console.log("Grinding time =", formatter.format(buildCost / base_dust) + "s.");
    console.log("Clearing time =", formatter.format(toKill / AB.sessionEnemiesKilled * AB.lootAvg.counter / 1000) + "s.");

    console.log("Base value: " + formatter.format(base_dust) + " dust per second");
}

start();
