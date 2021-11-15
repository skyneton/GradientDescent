const Gradient = () => {
    const CanvasWidth = 500;
    const CanvasHeight = 500;

    const canvasDelta = 20;

    const CanvasCenter = {
        x: CanvasWidth / 2 + canvasDelta / 2,
        y: CanvasHeight / 2 + canvasDelta / 2
    };

    const Width = 70;
    const Height = 70;

    const DeltaX = CanvasWidth / Width;
    const DeltaY = CanvasHeight / Height;

    const funcPosList = [];
    const gradientPosList = [];

    const Pos2CanvasPos = pos => {
        return {
            x: Math.round(CanvasCenter.x + pos.x * DeltaX),
            y: Math.round(CanvasHeight - (CanvasCenter.y + pos.y * DeltaY))
        };
    }

    let canvas, ctx;

    let movement;
    const currentPos = { x: 0, y: 0 };

    let work;

    const Friction = .09;
    const Gravity = .5;

    let isStart = false;

    const MaxSpeed = 9;

    return new class {
        constructor() {
            canvas = document.createElement("canvas");
            canvas.width = CanvasWidth + canvasDelta / 2;
            canvas.height = CanvasHeight + canvasDelta / 2;
            canvas.style = "display: block; margin: auto;";

            ctx = canvas.getContext("2d");
            ctx.textAlign = "center";

            document.body.insertBefore(canvas, document.body.children[0]);

            this.getFuncPos();
            this.canvasUpdate();
        }

        start() {
            movement = 0;
            if(!work)
                clearInterval(work);

            gradientPosList.length = 0;

            isStart = true;
            currentPos.x = this.randomPosX();
            // currentPos.x = 14.717832385105256;
            currentPos.y = this.func(currentPos.x);
            gradientPosList.push({x: currentPos.x, y: currentPos.y});

            const firstDer = this.derivative(currentPos.x);
            if(Math.abs(firstDer) < 1) {
                movement = firstDer < 0 ? 10 : -10;
            }

            work = setInterval(() => {
                movement -= this.derivative(currentPos.x) * Gravity;
                movement -= movement * Friction;
                let speed = movement;
                if(Math.abs(movement) > MaxSpeed)
                speed = movement < 0 ? -MaxSpeed : MaxSpeed;
                    
                
                currentPos.x += speed;
                // if(stopCount > 20) {
                //     currentPos.x = currentPos.x < 0 ? Math.ceil(currentPos.x) : Math.floor(currentPos.x);
                // }
                
                currentPos.y = this.func(currentPos.x);
                gradientPosList.push({x: currentPos.x, y: currentPos.y});

                this.canvasUpdate();

                if(Math.abs(movement) <= .0001) {
                    clearInterval(work);
                }
            }, 80);
        }

        derivative(x) {
            const delta = 1e-7;
            return (this.func(x + delta) - this.func(x - delta))/(delta * 2);
        }

        randomPosX() {
            return Math.random() * (funcPosList[0].x - funcPosList[funcPosList.length - 1].x) + funcPosList[funcPosList.length - 1].x;
        }

        canvasUpdate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawXPosInfo();
            this.drawFunc();
            this.drawGradientPos();
            if(isStart)
                this.drawCurrentInfo();
        }

        drawCurrentInfo() {
            ctx.font = "bold 16px serif";
            const pos = Pos2CanvasPos(currentPos);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = "rgb(100, 200, 200)";
            ctx.fill();
            pos.y -= 24;
            pos.x += 25;
            ctx.fillStyle = "rgba(200, 255, 255, 0.8)";
            ctx.fillRect(pos.x - 50, pos.y - 16, 100, 22);
            ctx.fillStyle = "blue";
            ctx.fillText(`${Math.round(currentPos.x * 10)/10}, ${Math.round(currentPos.y * 10) / 10}`, pos.x, pos.y);
        }

        drawXPosInfo() {
            ctx.fillStyle = "black";
            ctx.font = "13px serif";
            for(let i = 0; i < Width << 1; i+=5) {
                const x = Pos2CanvasPos({x: i - Width, y: 0}).x;
                const y = canvas.height - (canvasDelta >> 4);
                ctx.fillText(Math.round(i - Width), x, y);
            }
        }

        drawGradientPos() {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            let isFirst = true;
            for(const pos of gradientPosList) {
                const canvasPos = Pos2CanvasPos(pos);
                if(isFirst) {
                    isFirst = false;
                    ctx.moveTo(canvasPos.x, canvasPos.y);
                    continue;
                }
                ctx.lineTo(canvasPos.x, canvasPos.y);
            }
            ctx.stroke();
        }

        drawFunc() {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            let isFirst = true;
            for(const pos of funcPosList) {
                const canvasPos = Pos2CanvasPos(pos);
                if(isFirst) {
                    isFirst = false;
                    ctx.moveTo(canvasPos.x, canvasPos.y);
                    continue;
                }
                ctx.lineTo(canvasPos.x, canvasPos.y);
            }
            ctx.stroke();
        }

        getFuncPos() {
            for(let i = 0; i < Width << 1; i+=.08) {
                const x = i - Width;
                const y = this.func(x);
                if(Math.abs(y) > Width)
                    continue;
                    
                funcPosList.push({
                    x,
                    y
                });
            }
        }

        // func(x) {
        //     return Math.pow(x, 4) / 880 + Math.pow(x, 3) / 90 - Math.pow(x, 2) / 8 - 10;
        // }

        // func(x) {
        //     return Math.pow(x, 2) / 9 - 30;
        // }

        // func(x) {
        //     return Math.pow(x / 55, 6) + Math.pow(x, 4) / 550 - Math.pow(x, 3) / 30 - Math.pow(x, 2) / 80 + x * 3 - 10;
        // }

        func(x) {
            return Math.abs(x) - 15;
        }

        get posX() {
            return currentPos.x;
        }

        get gradientPosList() {
            return gradientPosList;
        }
    }
}

const gradient = Gradient();

document.querySelector("button").onclick = e => {
    gradient.start();
}