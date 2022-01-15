import Player from "./Player";

export default class PlayerTable {
    constructor(public players: Player[]) {
        players.map(function(player) {
            for (let l = 2; l <= player.name.length; l++) {
                const abbrev = player.name.replace("　", "").slice(0, l);
                if (
                    players.every(function(p) {
                        return player.name == p.name || p.name.indexOf(abbrev) != 0;
                    })
                ) {
                    player.abbrev = abbrev;
                    return;
                }
            }
        });
    }

    public writeOrder() {
        this.players.forEach((player, num) => {
            player.order = num;
        });
    }
}
