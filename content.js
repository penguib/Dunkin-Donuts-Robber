 document.addEventListener('DOMContentLoaded', function () { // save the level getting harder

     const btt = document.getElementById("img");
     const img = document.getElementById("img");
     const ind = document.getElementById("indicator");
     const progess = document.getElementById("progress-bar");
     const levelTxt = document.getElementById("level");

     let score = 0;
     let stretchScore = 1;
     let incNum = 5;
     let level = 1;
     let sbIndex = 1;
     let character = 0;

     let multiplier = {
         active: true,
         level: 1,
         incAmt: 0.06,
         stretches: 5,
         mult: 0.1
     }


     let stretches = [{
         "msg": "very tight",
     }, {
         "msg": "tight",
     }, {
         "msg": "getting looser",
     }, {
         "msg": "flexible",
     }];


     chrome.storage.sync.get(['WDTH_SS', 'MULT_TABLE', 'LVL_CHR'], function (result) {
         console.log(result)
         if (typeof result !== "undefined") {
             //  if (typeof result.WDTH_SS.WDTH !== "undefined") {
             //      progess.setAttribute("style", `width: ${result.WDTH_SS.WDTH}px`)
             //  }
             if (typeof result.MULT_TABLE !== "undefined") {
                 let res = result.MULT_TABLE;
                 multiplier.level = res.level;
                 multiplier.stretches = res.stretches;
                 updateInd();
             } else {
                 updateInd();
             }
             if (typeof result.LVL_CHR !== "undefined") {
                 level = result.LVL_CHR.LVL;
                 levelTxt.innerHTML = `Level ${level}`
             } else {
                 levelTxt.innerHTML = `Level ${level}`
             }
             if (typeof result.LVL_CHR !== "undefined") {
                 character = result.LVL_CHR.CHAR;
                 img.src = char("1")
             } else {
                 character = 0;
             }
         }
     });


     function incW(num, reset) {
         let newWidth = 0;

         function reset(inc) {
             let perInc = 0.05 * inc;
             score = 0;
             level++;
             if (level == 25 && level < 49) {
                 character = 1;
             } else if (level >= 50) {
                 character = 2;
             } else if (level > 10) {
                 character = 0;
             }
             SAVE_DATA(true, true);
             levelTxt.innerHTML = `Level ${level}`
             return inc -= perInc;
         }

         let width = progess.offsetWidth;
         if (width >= 265) {
             width = 0;
             incNum = reset(incNum);
         }
         if (multiplier.active) {
             newWidth = (width + num) + multiplier.mult * 2;
         } else {
             newWidth = width + num;
         }
         return progess.style.width = newWidth + 'px';
     }


     function char(num) {
         if (character == 0) {
             return `./Images/stretch${num}.png`
         } else if (character == 1) {
             return `./Images/p${num}.png`
         } else if (character == 2) {
             return `./Images/sb${num}.png`
         }
     }



     function SAVE_DATA(bool, $) {
         if (bool) {
             if ($) {
                 chrome.storage.sync.set({
                     "LVL_CHR": {
                         "LVL": level,
                         "CHAR": character
                     }
                 }, function () {
                     console.log("saved")
                 })
             } else if (!$) {
                 chrome.storage.sync.set({
                     "MULT_TABLE": {
                         "level": multiplier.level,
                         "stretches": multiplier.stretches,
                     }
                 }, function () {
                     console.log("saved")
                 })
             }
         } else if (!bool) {
             chrome.storage.sync.set({
                 "WDTH_SS": {
                     //"WDTH": progess.offsetWidth,
                     "SS": stretchScore
                 }
             }, function () {
                 console.log("saved")
             })
         }
     }


     function updateInd() {
         let width = 265;
         let barW = progess.offsetWidth;
         if (barW <= width / 4) { // 0-66.25
             ind.innerHTML = stretches[0].msg;
         } else if (barW >= width / 2 && barW <= (3 * width) / 4) { // 66.25-132.5
             ind.innerHTML = stretches[1].msg;
         } else if (barW >= (3 * width) / 4 && barW <= width) { // 198.75
             ind.innerHTML = stretches[2].msg;
         } else if (barW >= width) { // 265
             ind.innerHTML = stretches[3].msg;
         }
     }


     function sbI(img) {
         if (sbIndex === 4) {
             sbIndex = 1;
             return img.src = char("1");
         } else {
             sbIndex++;
             return img.src = `./Images/sb${sbIndex}.png`;
         }
     }

      document.addEventListener('keydown', function (event) {
          if (event.keyCode === 39) { // right arrow
              if (character == 2) {
                  sbI(img);
                  incW(incNum);
                  updateInd();
                  score++;
                  //SAVE_DATA(false);
              } else {
                  if (score % 2 == 0) {
                      incW(incNum);
                      updateInd();
                      score++;
                      //SAVE_DATA(false);
                      img.src = char("2");
                  }
              }
          } else if (event.keyCode === 37) { // left arrow
              if (character == 2) {
                  sbI(img);
                  incW(incNum);
                  updateInd();
                  score++;
                  //SAVE_DATA(false);
              } else {
                  if (score % 2 !== 0) {
                      incW(incNum);
                      updateInd();
                      score++;
                      //SAVE_DATA(false);
                      img.src = char("1");
                  }
              }
          }
      })

     btt.addEventListener("click", function () {
             debounce = true
             score++;
             incW(incNum); //52
             updateInd();
             if (character == 2) {
                 sbI(img)
             } else {
                 if (score % 2 == 0) { // if the number is even have sONe if odd have sTwo
                     img.src = char("1")
                 } else {
                     img.src = char("2")
                 }
             }
            

     })

 })