function Game(level) {

    switch (level) {
        case 'easy':
            board = new Board(9,9);
            break;
        case 'hard':
            board = new Board(24, 24);
            break;
        case 'medium':
        default:
            board = new Board(16, 16);
            break;
    }
    board.render();
    board.gameOver = false;

    $('.space').click(function (Object) {
        board.click(Object.target);
    });

    return board;
}

function Board(row, col){
    this.row = row;
    this.col = col;   
    this.spaces = [];    
    this.gameOver = false;
    this.Cleared = 0;
    this.bombCount = 0;

    this.click = function (target_elem) {
        var row = $(target_elem).attr("data-row");
        var col = $(target_elem).attr("data-col");

        if (this.gameOver === true) {
            return;
        }

        if (this.spaces[row - 1][col - 1].explored == true) {
            return;
        }

        if (this.spaces[row - 1][col - 1].notexplored == -1) {
            this.explode();
        } else if (this.spaces[row - 1][col - 1].notexplored == 0) {
            this.clear(row - 1, col - 1);
            surrounds.call(this, row - 1, col - 1);
        } else {
            this.clear(row - 1, col - 1);
        }
    }

    this.render = function() {
        var spaces = "";
        for (i = 1; i <= row; i++) {
            for (j = 1; j <= col; j++) {
                spaces = spaces.concat('<div class="space" data-row="' + i + '" data-col="' + j + '">&nbsp;</div>');
            }
            spaces = spaces.concat('<br />');
        }
        $('#board').empty();
        $('#board').append(spaces);
    }

    this.explode = function() {
        for (i = 0; i < this.row; i++) {
            for (j = 0; j < this.col; j++) {
                if (this.spaces[i][j].notexplored == -1) {
                    var dom_target = 'div[data-row="' + (i + 1) + '"][data-col="' + (j + 1) + '"]';
                    $(dom_target).addClass('bomb');
                    $(dom_target).html('<i class="fa fa-bomb"></i>');
                }
            }
        }
        this.gameOver = true;
        $('#game').show();
    }

    var numBombNear = function(row, col) {
        var sum = 0;

        if (this.spaces[row][col].notexplored == -1) {
            return -1;
        }

        sum += valueAt.call(this, row - 1, col - 1) 
            + valueAt.call(this, row - 1, col) 
            + valueAt.call(this, row - 1, col + 1) 
            + valueAt.call(this, row, col - 1) 
            + valueAt.call(this, row, col + 1) 
            + valueAt.call(this, row + 1, col - 1) 
            + valueAt.call(this, row + 1, col) 
            + valueAt.call(this, row + 1, col + 1);

        return sum;
    }

    function valueAt(row, col) {
        if (row < 0 || row >= this.row || col < 0 || col >= this.col) {
            return 0;
        } else if(this.spaces[row][col].notexplored == -1){
            return 1;
        } else {
            return 0;
        }
    }

    if (this.spaces !== undefined) {
        this.spaces = new Array(this.row);

        for (i = 0; i < this.row; i++) {
            this.spaces[i] = new Array(this.col);
            for (j = 0; j < this.col; j++) {
                this.spaces[i][j] = new Space(false, 0);
            }
        }

        var min = 1;
        var max = this.row * this.col;
        this.bombCount = Math.round((Math.random() * ((max / 2) - min) + (min)));
        $('#value').html(this.bombCount);
        for (i = 0; i < this.bombCount; i++) {
            var bombIndex = Math.round(Math.random() * (max - 1));
            var x = Math.floor(bombIndex / this.col);
            var y = bombIndex % this.col;
            this.spaces[x][y] = new Space(false, -1);
        }

        for (i = 0; i < this.row; i++) {
            for (j = 0; j < this.col; j++) {
                this.spaces[i][j].notexplored = numBombNear.call(this, i, j);
            }
        }
    }

    this.clear = function (row, col) {
        var dom_target = 'div[data-row="' + (row + 1) + '"][data-col="' + (col + 1) + '"]';
        $(dom_target).addClass('safe');
        if (this.spaces[row][col].notexplored > 0) {
            $(dom_target).text(this.spaces[row][col].notexplored);
        } else {
            $(dom_target).html('&nbsp');
        }
        ExploredCells.call(this);
        this.Cleared++;
        this.spaces[row][col].explored = true;
    }

    function ExploredCells(){
        if (this.row * this.col - this.Cleared == this.bombCount) {
            for (i = 0; i < this.row; i++) {
                for (j = 0; j < this.col; j++) {
                    if (this.spaces[i][j].notexplored == -1) {
                        var bomb_target = 'div[data-row="' + (i + 1) + '"][data-col="' + (j + 1) + '"]';
                        $(bomb_target).html('<i class="fa fa-smile-o"></i>');
                        this.gameOver = true;
                        $('#game').show();
                    }
                }
            }
        }
    }

    function surrounds(row, col) {
        checking.call(this, row - 1, col - 1); 
        checking.call(this, row - 1, col); 
        checking.call(this, row - 1, col + 1);
        checking.call(this, row, col - 1); 
        checking.call(this, row, col + 1);
        checking.call(this, row + 1, col - 1); 
        checking.call(this, row + 1, col); 
        checking.call(this, row + 1, col + 1);
        ExploredCells.call(this);
    }

    function checking(row, col) {
        if (row < 0 || row >= this.row || col < 0 || col >= this.col || this.spaces[row][col].explored == true) {
            return;
        } else if (this.spaces[row][col].notexplored >= 0) {
            this.clear(row, col);
            if (this.spaces[row][col].notexplored == 0) {
                surrounds.call(this, row, col);
                return;
            }
        }
    }
}

function Space(explored, notexplored){
    this.explored = explored;
    this.notexplored = notexplored;
}