// Run on https://www.shogi.or.jp/match/junni/2021/80a/index.html

var names = collectNames();
var namesToMatch = names.map(name => name.replace(/[\s　]+/, ""));
var games = tableToGames(collectTable());
var doneGames = $.map(games.done, function (n) {
    return n;
});
var notyetGames = $.map(games.notyet, function (n) {
    return n;
});


console.log(JSON.stringify({players: names, doneGames, undoneGames: notyetGames}));

function collectNames() {
    var names = $("table.league tbody tr td:nth-child(3)").map(function (n, tr) {
        return tr.textContent;
    });
    var ret = [];
    for (var i = 0; i < names.length; i++) {
        ret.push(names[i]);
    }
    return ret;
}
function getIndex(name, td) {
    for (var i = 0; i < namesToMatch.length; i++) {
        if (namesToMatch[i].indexOf(name) == 0)return i;
    }
    console.error("player name", name, "not found", td)
    throw `player name ${name} not found`
}
function collectTable() {
    var matrix = $("table.league tbody tr").map(function (n, tr) {
        return $(tr.children).slice(5)
    });
    var ret = [];
    for (var i = 0; i < matrix.length; i++) {
        var row = [];
        for (var j = 0; j < matrix[i].length; j++) {
            const cellInfo = getCellInfo(matrix[i][j]);
            const formatted = formatCellInfo(cellInfo, i);
            row.push(formatted);
        }
        ret.push(row);
    }
    return ret;
}
function getCellInfo(td) {
    var tmp = td.textContent.split(/\n/).map(function (s) {
        return s.trim();
    });
    if (!tmp[1] || tmp[1] === "-") return null;
    return {
        score: (tmp[0] == "○" ? 1 : (tmp[0] == "●" ? -1 : 0)),
        enemy: getIndex(tmp[1], td)
    };
}
function formatCellInfo(cellInfo, index) {
    if (!cellInfo) return [index];
    if (cellInfo.score == 0) return [Infinity, index, cellInfo.enemy].sort();
    return cellInfo.score == 1 ? [index, cellInfo.enemy] : [cellInfo.enemy, index];
}
function tableToGames(table) {
    var ret = [];
    var notyet = [];
    for (var j = 0; j < table[0].length; j++) {
        var notyetround = false;
        var round = [];
        for (var i = 0; i < table.length; i++) {
            var game = table[i][j];
            if (game.length == 1) {
                ret.push([game]); // against concat
                continue;
            }
            if (game.length == 3) {
                notyetround = true;
                game = [game[0], game[1]];
            }
            if (round.every(function (g) {
                return g[0] != game[0]
            })) round.push(game);
        }
        if (notyetround) {
            notyet.push(round);
        } else {
            ret.push(round);
        }
    }
    return {done: ret, notyet: notyet};
}
