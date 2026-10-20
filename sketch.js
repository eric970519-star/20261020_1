// 宣告全域變數
let questions = [];      // 儲存六個拖曳題目的陣列
let options = [];        // 儲存六個下方文字選項的陣列
let gif1, gif2, gif3;    // 儲存三個動畫 GIF 的變數
let submitButton;        // 交卷按鈕
let score = -1;          // 儲存最後測驗成績（-1代表尚未交卷）
let confettiList = [];   // 儲存彩帶特效的陣列

// preload 預載入函數：在程式執行前先透過 Giphy 網址載入三個動畫 GIF
function preload() {
  gif1 = loadImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2o0Zmd5MjduczkxOW14b2Mxazh4OGtvemJ3czE0NXQzdDhuYjlucCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/1TM8yYG2kMInpK69Rc/giphy.gif');
  gif2 = loadImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2o0Zmd5MjduczkxOW14b2Mxazh4OGtvemJ3czE0NXQzdDhuYjlucCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/VkpfO6W4D7yB7vSjXy/giphy.gif');
  gif3 = loadImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2o0Zmd5MjduczkxOW14b2Mxazh4OGtvemJ3czE0NXQzdDhuYjlucCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/H5C8CevNMbpBqNqFjl/giphy.gif');
}

// setup 初始化函數：設定畫布與初始化題目及選項
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定文字對齊方式
  textAlign(CENTER, CENTER);

  // 初始化六個 p5.js 程式設計題目（包含題目敘述、正確答案、目標放置區座標）
  // 為了配合放大的 GIF，將目標區的 Y 座標往下微調
  questions = [
    { id: 1, text: "1. 建立畫布大小的指令", answer: "createCanvas()", targetX: 180, targetY: 310, currentOption: null },
    { id: 2, text: "2. 設定背景顏色的指令", answer: "background()", targetX: 380, targetY: 310, currentOption: null },
    { id: 3, text: "3. 繪製橢圓形的指令", answer: "ellipse()", targetX: 580, targetY: 310, currentOption: null },
    { id: 4, text: "4. 設定填滿顏色的指令", answer: "fill()", targetX: 780, targetY: 310, currentOption: null },
    { id: 5, text: "5. 畫出矩形框的指令", answer: "rect()", targetX: 980, targetY: 310, currentOption: null },
    { id: 6, text: "6. 設定外框線顏色的指令", answer: "stroke()", targetX: 1180, targetY: 310, currentOption: null }
  ];

  // 初始化六個下方的文字選項
  let optionTexts = [
    "createCanvas()", 
    "background()", 
    "ellipse()", 
    "fill()", 
    "rect()", 
    "stroke()"
  ];
  
  // 透過迴圈將選項排列在畫布下方
  let startX = 180;
  let startY = 590;
  for (let i = 0; i < optionTexts.length; i++) {
    options.push({
      text: optionTexts[i],
      x: startX + (i % 3) * 320,   // 計算選項在畫布上的 X 軸排列位置
      y: startY + Math.floor(i / 3) * 70, // 計算選項在畫布上的 Y 軸排列位置
      origX: startX + (i % 3) * 320,  // 記錄初始 X 位置（答錯或未放好時彈回）
      origY: startY + Math.floor(i / 3) * 70, // 記錄初始 Y 位置
      dragging: false,             // 是否正在被滑鼠拖曳中
      lockedInTarget: null         // 目前被放置在哪一個題目目標區
    });
  }

  // 建立「交卷看成績」按鈕
  submitButton = createButton('交卷看成績');
  submitButton.position(windowWidth / 2 - 75, windowHeight - 75);
  submitButton.size(150, 45);
  submitButton.style('font-size', '16px');
  submitButton.style('background-color', '#4CAF50');
  submitButton.style('color', 'white');
  submitButton.style('border-radius', '8px');
  submitButton.mousePressed(calculateScore);
}

// draw 繪製函數：每秒執行約 60 次，負責更新與渲染畫面
function draw() {
  // 設定背景顏色為柔和的淡藍色
  background(225, 240, 255);

  // 1. 繪製上方標題與說明文字
  fill(30, 60, 90);
  textSize(24);
  text("【p5.js 程式設計拖曳測驗系統】", windowWidth / 2, 25);
  
  textSize(14);
  fill(80, 100, 120);
  text("請將下方正確的指令選項拖曳至上方對應的題目區塊中，完成後點擊交卷按鈕！", windowWidth / 2, 50);

  // 2. 在畫布上方並排繪製三個放大版的動態 GIF 動畫
  let gifWidth = 180;   // 放大寬度
  let gifHeight = 130;  // 放大高度
  let centerX = windowWidth / 2;

  if (gif1) image(gif1, centerX - 280, 65, gifWidth, gifHeight);
  if (gif2) image(gif2, centerX - 90, 65, gifWidth, gifHeight);
  if (gif3) image(gif3, centerX + 100, 65, gifWidth, gifHeight);

  // 3. 繪製上方六個題目的目標放置區
  for (let i = 0; i < questions.length; i++) {
    let q = questions[i];
    
    // 繪製目標框外框與背景
    stroke(100, 150, 200);
    strokeWeight(2);
    fill(255, 255, 255, 220);
    rectMode(CENTER);
    rect(q.targetX, q.targetY, 180, 60, 10);

    // 顯示題目說明文字
    noStroke();
    fill(20, 40, 60);
    textSize(13);
    text(q.text, q.targetX, q.targetY - 15);

    // 如果該題目區塊內已經放置了選項，顯示選項內容
    if (q.currentOption !== null) {
      fill(0, 100, 200);
      textSize(15);
      text(q.currentOption.text, q.targetX, q.targetY + 12);
    } else {
      fill(150, 150, 150);
      textSize(12);
      text("(請將選項拖曳至此)", q.targetX, q.targetY + 12);
    }
  }

  // 4. 繪製下方六個文字選項卡片
  rectMode(CORNER);
  for (let i = 0; i < options.length; i++) {
    let o = options[i];

    // 如果選項正在被拖曳，跟隨滑鼠座標移動
    if (o.dragging) {
      o.x = mouseX - 90;
      o.y = mouseY - 22;
    }

    // 繪製選項外框與填滿色
    stroke(50, 100, 150);
    strokeWeight(1);
    if (o.lockedInTarget !== null) {
      fill(210, 225, 240, 180); // 被放入題目後顯示較淡顏色
    } else {
      fill(255, 255, 255);
    }
    rect(o.x, o.y, 180, 45, 8);

    // 繪製選項卡片文字
    noStroke();
    fill(30, 30, 30);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(o.text, o.x + 90, o.y + 22.5);
  }

  // 5. 如果已經交卷，顯示成績看板
  if (score !== -1) {
    drawScoreBoard();
  }

  // 6. 如果成績大於等於 60%，持續渲染彩色帶子特效畫布
  if (score >= 60) {
    updateAndDrawConfetti();
  }
}

// mousePressed 滑鼠按下事件：判斷是否點擊到選項卡片以進行拖曳
function mousePressed() {
  for (let i = 0; i < options.length; i++) {
    let o = options[i];
    // 檢查滑鼠座標是否在選項範圍內
    if (mouseX >= o.x && mouseX <= o.x + 180 && mouseY >= o.y && mouseY <= o.y + 45) {
      o.dragging = true;
      
      // 如果該選項原本已經放在某個題目中，清除該題目的記錄
      if (o.lockedInTarget !== null) {
        let qIndex = o.lockedInTarget;
        questions[qIndex].currentOption = null;
        o.lockedInTarget = null;
      }
      break;
    }
  }
}

// mouseReleased 滑鼠放開事件：判斷選項是否被拖曳放置到目標題目區內
function mouseReleased() {
  for (let i = 0; i < options.length; i++) {
    let o = options[i];
    if (o.dragging) {
      o.dragging = false;
      
      let droppedInTarget = false;

      // 檢查是否落在任一個題目的範圍內
      for (let j = 0; j < questions.length; j++) {
        let q = questions[j];
        let centerX = o.x + 90;
        let centerY = o.y + 22.5;
        
        if (centerX >= q.targetX - 90 && centerX <= q.targetX + 90 &&
            centerY >= q.targetY - 30 && centerY <= q.targetY + 30) {
          
          // 如果該目標區已經有其他選項，先將舊選項彈回原位
          if (q.currentOption !== null) {
            let oldOpt = q.currentOption;
            oldOpt.lockedInTarget = null;
            oldOpt.x = oldOpt.origX;
            oldOpt.y = oldOpt.origY;
          }

          // 將選項吸附對齊到目標區中心座標
          o.x = q.targetX - 90;
          o.y = q.targetY - 22.5;
          o.lockedInTarget = j;
          q.currentOption = o;
          droppedInTarget = true;
          break;
        }
      }

      // 如果沒有放入任何目標區，則讓選項彈回原本的出發位置
      if (!droppedInTarget) {
        o.x = o.origX;
        o.y = o.origY;
        o.lockedInTarget = null;
      }
    }
  }
}

// calculateScore 計算成績函數：點擊交卷按鈕時觸發
function calculateScore() {
  let correctCount = 0;

  // 檢查每一個題目的選項是否正確
  for (let i = 0; i < questions.length; i++) {
    let q = questions[i];
    if (q.currentOption !== null) {
      if (q.currentOption.text === q.answer) {
        correctCount++;
      }
    }
  }

  // 計算百分比成績（總共 6 題）
  score = Math.round((correctCount / questions.length) * 100);

  // 若成績 >= 60%，初始化彩帶粒子
  if (score >= 60) {
    initConfetti();
  }
}

// drawScoreBoard 繪製成績彈窗函數
function drawScoreBoard() {
  // 繪製半透明全螢幕遮罩
  fill(0, 0, 0, 160);
  rectMode(CORNER);
  rect(0, 0, windowWidth, windowHeight);

  // 繪製成績視窗背景
  fill(255);
  stroke(0, 120, 220);
  strokeWeight(4);
  rectMode(CENTER);
  rect(windowWidth / 2, windowHeight / 2, 450, 260, 15);

  // 顯示分數與評語
  noStroke();
  fill(20, 30, 40);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("測驗成績結算", windowWidth / 2, windowHeight / 2 - 70);

  textSize(22);
  fill(30, 100, 200);
  text("總得分：" + score + " 分", windowWidth / 2, windowHeight / 2 - 15);

  textSize(16);
  if (score >= 60) {
    fill(0, 160, 0);
    text("🎉 及格過關！太棒了，獲得彩帶特效！", windowWidth / 2, windowHeight / 2 + 30);
  } else {
    fill(200, 50, 50);
    text("💪 未滿 60 分，請重新整理頁面再試一次！", windowWidth / 2, windowHeight / 2 + 30);
  }
}

// initConfetti 初始化彩帶特效陣列
function initConfetti() {
  confettiList = [];
  for (let i = 0; i < 120; i++) {
    confettiList.push({
      x: random(windowWidth),
      y: random(-windowHeight, 0),
      sizeX: random(8, 16),
      sizeY: random(4, 10),
      speedY: random(2, 6),
      speedX: random(-2, 2),
      color: color(random(255), random(255), random(255)),
      angle: random(TWO_PI),
      spin: random(0.02, 0.1)
    });
  }
}

// updateAndDrawConfetti 更新並繪製彩帶動畫
function updateAndDrawConfetti() {
  for (let i = 0; i < confettiList.length; i++) {
    let c = confettiList[i];
    
    // 更新彩帶座標與旋轉
    c.y += c.speedY;
    c.x += c.speedX + sin(c.angle);
    c.angle += c.spin;

    // 若掉落至畫面下方，重新回到上方循環
    if (c.y > windowHeight) {
      c.y = random(-50, 0);
      c.x = random(windowWidth);
    }

    // 繪製彩帶粒子
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    noStroke();
    fill(c.color);
    rectMode(CENTER);
    rect(0, 0, c.sizeX, c.sizeY);
    pop();
  }
}

// windowResized 視窗大小改變時自動調整畫布與按鈕位置
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  submitButton.position(windowWidth / 2 - 75, windowHeight - 75);
}