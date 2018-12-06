function init() {
    let canvas = $("#canvas")[0];
    let context = canvas.getContext('2d');
    let gameData = {
        gameDifficulty: 1000,
        missed: 0,
        hit: 0,
        totalClicks: 0,
        score: 0,
        started: 0,
    }

    let circles = [];
    let inter = null;
    let timeInterval = null;

    canvas.width = 1024;
    canvas.height = 768;

    canvas.addEventListener('click', (e) => {
        gameData.totalClicks++;
        let mousePos = getMousePos(canvas, e);
        for (let i = circles.length - 1; i >= 0; --i) {
            if (Math.sqrt((mousePos.x - circles[i].x) * (mousePos.x - circles[i].x) + (mousePos.y - circles[i].y) * (mousePos.y - circles[i].y)) < circles[i].radius) {
                drawCircle(circles[i].x, circles[i].y, circles[i].radius + 1, "white");
                gameData.hit++;
                gameData.score += 25 - parseInt(circles[i].radius);
                circles.splice(i, 1);
            }
        }
        calculateAccuracy();
    });

    $('.playGame').on('click', function () {
        let isSelected = $(this).attr('data-selected');
        if (isSelected != 'true') {
            startGame();
            $(this).html('RESET').attr('data-selected', true)
        } else {
            resetGame();
            $(this).html('START').attr('data-selected', false)
        }
    })

    $('.difficulty>button').on('click', function () {
        $(this).attr("style", "background-color: #3e8e41;");
        $(this).siblings().attr("style", "background-color: #4CAF50;");

        let difficulty = $(this).text();
        switch (difficulty) {
            case "Easy":
                gameData.gameDifficulty = 1000;
                break;
            case "Medium":
                gameData.gameDifficulty = 750;
                break;
            case "Hard":
                gameData.gameDifficulty = 500;
                break;
            default:
                gameData.gameDifficulty = 1000;
        }
    });

    $("#canvas").mousemove((e) => {
        e.preventDefault();
        e.stopPropagation();
        canvas.style.cursor = 'crosshair';
    });

    function calculateAccuracy() {
        let accuracy = ((gameData.hit / gameData.totalClicks) * 100).toFixed(1);
        $("#score").text(gameData.score);
        $("#accuracy").text(accuracy);
    }

    function getMousePos(canvas, evt) {
        var rectangle = canvas.getBoundingClientRect(),
            root = document.documentElement;

        var mouseX = evt.clientX - rectangle.left;
        var mouseY = evt.clientY - rectangle.top;

        return {
            x: mouseX,
            y: mouseY
        };
    }

    function startGame() {
        gameData.started = 1;
        $('.difficulty>button').prop("disabled", true);

        gameData.missed = 0;
        gameData.hit = 0;
        gameData.totalClicks = 0;
        gameData.score = 0;
        gameData.started = 0;

        inter = setInterval(() => {
            var randomWidth = Math.floor(Math.random() * (canvas.width + 1)),
                randomHeight = Math.floor(Math.random() * (canvas.height + 1))
            circles.unshift({
                x: randomWidth,
                y: randomHeight,
                radius: 10,
                colour: "#000000",
                missed: 0
            });
        }, gameData.gameDifficulty);

        timeInterval =
            setInterval(function () {
                $("#time").text(parseInt($("#time").text()) + 1);
            }, 1000);

        $("#time").text(0);
    }

    function resetGame() {
        clearInterval(inter);
        clearInterval(timeInterval);
        circles = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
        $('.difficulty>button').prop("disabled", false);
        $("#accuracy").text(0);
        $("#score").text(0);
        $("#time").text(0);
    }

    function drawCircle(x, y, radius, color) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
    }

    function draw() {
        for (let i = circles.length - 1; i >= 0; --i) {
            drawCircle(circles[i].x, circles[i].y, circles[i].radius, circles[i].colour);
            if (circles[i].radius < 20) {
                circles[i].radius += 0.05;
            } else if (circles[i].missed == 0) {
                circles[i].missed = 1;
                gameData.missed++;
                console.log(gameData.missed);
            } else {
                drawCircle(circles[i].x, circles[i].y, circles[i].radius + 1, "white");
                gameData.score -= 35;
                gameData.totalClicks++;
                calculateAccuracy();
                circles.splice(i, 1);
            }
        }

        context.drawImage(canvas, 0, 0);
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

window.addEventListener('load', init, false);
