/*
All Images And Artwork were created by Dionna Johnson©

Music,sound and icons effects belong to their rightful owners

Microsoft©
Nintendo©
Capcom©
Tecmo©
Midway Games©

Any sound effects or music without a specific tag are credited to their original creators.
*/

// typewriter text effect
function typer(){
  var tips = ["Did You Know Doing Quizzes Gives You More EXP Points Than doing Lessons","Did You Know That For Every Minute You Are In A Lesson You Gain Additinal Exp?",
  "More Comming Soon In Future Updates!!!"];
  var loading_progress = "........";
  var random_tip = Math.floor(Math.random() * tips.length);
  var typerloop;
  var typerloop_1;
  var index = 0;
  var index1 = 0;
  
  setText("text","");
  setText("label3","");
  
  typerloop = timedLoop(50,function(){
    setText("text",getText("text") + tips[random_tip][index]);
    index++;
    
    if (index >= tips[random_tip].length){
      stopTimedLoop(typerloop);
    }
  });
  typerloop_1 = timedLoop(1200,function(){
    setText("label3",getText("label3") + loading_progress[index1]);
    index1++;
    
    if (index1 >= loading_progress.length){
      setText("label3","");
    }
  });
}

typer();
// checks the stuff everytime its called since its not in a loop 
function update(){
  var max_width_lv = 75;
  var requirement = activeUser.level_requirements;
  var player_current_xp = activeUser.user_xp;
  
  var fraction = player_current_xp / requirement;
  var progress_width = max_width_lv * fraction;
  setProperty("Lv_up_bar", "width", progress_width);
  
  if (activeUser.lesson_unlock1 && activeUser.lesson == 1){
    setText("lesson_progress_number",33);
    setProperty("progress_bar","width",21.45);
    showElement("defensive_play_unlocked");
    showElement("defensive_play_button");
    showElement("defensive_play_start");
  }
  if (activeUser.lesson_unlock2 && activeUser.lesson == 2){
    showElement("quiz_unlock");
    showElement("quiz_unlock_start_button");
    showElement("quiz_unlock_start");
    setText("lesson_progress_number",90);
    setProperty("progress_bar","width",58.5);
  }
  if (activeUser.finished){
    setText("lesson_progress_number",100);
    setProperty("progress_bar","width",65);
  }
  if (activeUser.user_xp >= activeUser.level_requirements){
    activeUser.level_up();
    activeUser.level_requirements = activeUser.level_requirements * 2;
    setProperty("Lv_up_bar","width",0);
    console.log(activeUser.user_xp);
  }
}

// something to give a visual that you earned some money
function showMoneyGif() {
  showElement("money_earn");
  showElement("money_earn1");
  setTimeout(function() {
    hideElement("money_earn");
    hideElement("money_earn1");
  }, 2000);
}

// sends you to a page on a certain button
function button_page(button,page,which_audio){
  onEvent(button, "click", function( ) {
    pending_screen = page;
  	setScreen(page);
  	if (which_audio == 1){
      playSound("assets/se_system_fixed_s.wav");
    }
    else if (which_audio == 2){
      playSound("assets/se_system_fixed_l.wav");
    }
    else if (which_audio == 3){
      playclicksound();
    }
});
}

// takes you directly to a page 
function page(page_name){
  setScreen(page_name);
}

// gives user money on a certain button press
function button_page_reward(which_lesson,reward,xp){
  onEvent(which_lesson, "click", function( ){
  	setScreen("welcome_page_select_3");
  	pending_screen = "welcome_page_select_3";
  	activeUser.lesson += 1;
  	activeUser.earn_money(reward);
  	activeUser.user_xp += xp;
  	if (which_lesson == "next_button_video_2"){
  	  activeUser.lesson_unlock1 = true;
  	  activeUser.lesson = 1;
  	}
  	if (which_lesson == "next_16"){
  	  activeUser.lesson_unlock2 = true;
  	  activeUser.lesson = 2;
  	}
  	console.log(pending_screen);
  	update();
  });
}

// keeping user data organized and new functions to make my life easy
function User(name) {
  this.name = name || "placeholder";
  this.money = 0;
  this.lesson = 0;
  this.level = 1;
  this.lesson1_completed = false; 
  this.lesson2_completed = false;
  this.finished = false;
  this.level_requirements = 500;
  this.user_xp = 0;
  
  this.earn_money = function(amount) {
    this.money += amount;
    
    for (var i = 0; i < player_money_updater.length; i++) {
    setText(player_money_updater[i], activeUser.money);
  }
    playSound("assets/coin.mp3");
    showMoneyGif();
    update();
  };
  
  this.level_up = function() {
    this.level += 1;
    player_level_updater.push("player_level");
    for (var i = 0; i < player_level_updater.length; i++) {
    setText(player_level_updater[i], activeUser.level);
  }
    page("Level_UP");
    playSound("assets/18-Get-a-Heart-Container!.mp3");
  };
  this.lession = function(leval_gain) {
    this.level += leval_gain;
  };
}

// gives a cool smooth slide effect for the game selection 
function Smooth_slide(){
  var targetX = x_pos - 50; 
  playSound("assets/09.-Page-Right.mp3");
  timedLoop(10, function() {
    if (x_pos > targetX && x_pos > -45) {
      x_pos = x_pos - 2;
      setProperty("game_selection", "x", x_pos);
      setProperty("lesson_progress_number", "x", (x_pos - 38));
      setProperty("progress_bar", "x", (x_pos - 10));
    } else {
      stopTimedLoop();
      hideElement("more");
      showElement("more_back");
    }
  });
}

// same thing 
function Smooth_slide_back(){
  var targetX_1 = x_pos + 50; 
  playSound("assets/08.-Page-Left.mp3");
  timedLoop(10, function() {
    if (x_pos < targetX_1 && x_pos < 55) {
      x_pos = x_pos + 2;
      setProperty("game_selection", "x", x_pos);
      setProperty("lesson_progress_number", "x", (x_pos + 38));
      setProperty("progress_bar", "x", (x_pos + 10));
    } else {
      stopTimedLoop();
      hideElement("more_back");
      showElement("more");
    }
  });
}

// a thing that randomizes 5 sounds and plays them when you type
function playrandomsoundkey(){
  var random = Math.floor(Math.random() * key_sound.length);
  playSound(key_sound[random]);
}

// i was tired of manualy writing it so i did this
function playclicksound(){
  playSound("assets/mixkit-mouse-click-close-1113.mp3");
}
function showLoadingScreen() {
  setScreen("Loading_Screen");
}

function preLoad(list) {
  for (var i = 0; i < list.length; i++) {
    playSound(list[i], false, function() {
      stopSound();
    });
  }
  
  console.log("All " + list.length + " preload requests sent!");
}

function animateSprite(imageId, spriteList, speed) {
  var currentFrame = 0;
  
  timedLoop(speed, function() {
    currentFrame = (currentFrame + 1) % spriteList.length;
  
    setProperty(imageId, "image", spriteList[currentFrame]);
  });
}

/////////////////////////////////////////////////////////////////////////
var x_pos = 55;
var pending_screen = "";

// sprites 
var spriteStand = ["assets/paw3.png","assets/paw2.png","assets/paw1.png"];
animateSprite("image1", spriteStand, 200);

	// preload music
var MainMenu = ["assets/Shod-Xbox-360-Avatar-Editor-Back.mp3",
"assets/mixkit-mouse-click-close-1113.mp3","assets/08.-Page-Left.mp3",
"08.-Page-Right.mp3","assets/type_1.mp3","assets/type_2.mp3","assets/type_3.mp3",
"assets/type_4.mp3","assets/type_5.mp3","assets/type_6.mp3"];

var Ssbu = ["assets/18-Get-a-Heart-Container!.mp3",
"assets/ringtones-zelda-1.mp3","assets/sonic-error-sound.mp3",
"assets/untitled.mp3",
"assets/mixkit-mouse-click-close-1113.mp3","assets/08.-Page-Left.mp3","08.-Page-Right.mp3"];


// hide the buttons and stuff unlocks later
hideElement("money_earn");
hideElement("quiz_unlock");
hideElement("quiz_unlock_start_button");
hideElement("quiz_unlock_start");
hideElement("money_earn1");
hideElement("defensive_play_unlocked");
hideElement("defensive_play_button");
hideElement("defensive_play_start");
hideElement("more_back");
showElement("more");
setProperty("progress_bar","width",0);
setProperty("Lv_up_bar","width",0);

// when you get money updates the text on the screen with the correct money
var player_money_updater = [
    "player_currency27",
    "player_currency26",
    "player_currency25",
    "player_currency24",
    "player_currency23",
    "player_currency22",
    "player_currency21",
    "player_currency20",
    "player_currency19",
    "player_currency17",
    "player_currency16",
    "player_currency15",
    "player_currency14",
    "player_currency13",
    "player_currency12",
    "player_currency11",
    "player_currency10",
    "player_currency9",
    "player_currency8",
    "player_currency7",
    "player_currency6",
    "player_currency5",
    "player_currency4",
    "player_currency3",
    "player_currency2",
    "player_currency1",
    "player_currency"];
    
var player_level_updater = [];

for (var i = 1; i <= 26; i++) {
  player_level_updater.push("player_level" + i);
}


showLoadingScreen();
preLoad(MainMenu);
setTimeout(function() { 
  stopSound(); 
  setScreen("mainscreen_1"); 
  playSound("assets/Shod-Xbox-360-Avatar-Editor-Back.mp3", true); 
}, 10000);

// makes the class usable
var activeUser = new User();

// the sounds for the typeing
var key_sound = ["assets/type_1.mp3","assets/type_2.mp3","assets/type_3.mp3","assets/type_4.mp3","assets/type_5.mp3","assets/type_6.mp3"];

// user login information and checker
onEvent("button1", "click", function( ) {
	var email = getText("user_email");
	var username = getText("user_name");
	var password = getText("user_password");
	var confirm_password = getText("confirm_pass");
	var agree = getChecked("check_terms");
	
	if (email !== "" && username !== "" && password !== "" && confirm_password == password && agree){
	  playclicksound();
	  setScreen("Game_game_selection_BG");
	  activeUser.name = username;
	  setText("user",activeUser.name);
	}
});

// plays random key sound on type 
onEvent("user_email", "input", playrandomsoundkey);
onEvent("user_name", "input", playrandomsoundkey);
onEvent("user_password", "input", playrandomsoundkey);
onEvent("confirm_pass", "input", playrandomsoundkey);
onEvent("check_terms", "change", playclicksound);



// random makes button stuff smooth
onEvent("more_button", "click", function( ) {
  Smooth_slide();
});
onEvent("more_button_1", "click", function( ) {
	Smooth_slide_back();
});

// home button actions
button_page("start_app","sign-up-screen_2",3);
button_page("home_button","Game_game_selection_BG",1);
button_page("back","welcome_page_select_3");

// game selection page
button_page("select_game","Game_game_selection_BG",2);

// go to lesson
button_page("defensive_play_button","Lesson2/1",1);
button_page("start_neutral_game_button","RPG_1",1);

// swap diolog
button_page("next_button_1","RPG_2",1);
button_page("next_button_2","RPG_3",1);
button_page("next_button_3","RPG_4",1);
button_page("next_button_4","RPG_vid/after_4",1);
button_page("next_button_9","RPG_5",1);
button_page("next_button_5","RPG_6",1);
button_page("next_button_6","RPG_vid/after_6",1);
button_page("next_button_10","RPG_7",1);
button_page("next_button_7","RPG_8",1);
button_page("next_button_8","RPG_vid/after_8",1);
button_page_reward("next_button_video_2",100,300);

// lesson 2 diolog swap
button_page("next_9","Lesson2/2",1);
button_page("next_11","Lesson2/3",1);
button_page("next_12","Lesson2/after_3_video",1);
button_page("next_18","Lesson2/4",1);
button_page("next_13","Lesson2/5",1);
button_page("next_14","Lesson2/6",1);
button_page("next_15","Lesson2/after_6_video",1);
button_page("next_19","Lesson2/7",1);
button_page_reward("next_16",100,200);

// final quiz swap
button_page("quiz_unlock_start_button","Quiz_1",2);

// back buttons
button_page("back1","welcome_page_select_3",1);
button_page("back2","welcome_page_select_3",1);
button_page("back3","RPG_1",1);
button_page("back4","RPG_2",1);
button_page("back5","RPG_3",1);
button_page("back6","RPG_4",1);
button_page("back7","RPG_vid/after_4",1);
button_page("back8","RPG_5",1);
button_page("back9","RPG_6",1);
button_page("back10","RPG_vid/after_6",1);
button_page("back11","RPG_7",1);
button_page("back12","RPG_8",1);
button_page("back13","welcome_page_select_3",1);
button_page("back14","Lesson2/1",1);
button_page("back15","Lesson2/2",1);
button_page("back16","Lesson2/3",1);
button_page("back17","Lesson2/after_3_video",1);
button_page("back18","Lesson2/4",1);
button_page("back19","Lesson2/5",1);
button_page("back20","Lesson2/6",1);
button_page("back21","Lesson2/after_6_video",1);


// quiz logic 
onEvent("answer_quiz1", "click", function( ) {
  var answer_1 = getChecked("answer4");
  var answer_2 = getChecked("answer3");
  var answer_3 = getChecked("answer2");
  var answer_4 = getChecked("answer1");
  
  // checks if only the right answer is selected and not another
  if (answer_1 && !answer_2 && !answer_3 && !answer_4){
    playSound("assets/ringtones-zelda-1.mp3");
    activeUser.user_xp += 400;
    pending_screen = "Quiz_2";
    page("Quiz_2");
    update();
  } else{
    playSound("assets/sonic-error-sound.mp3");
  }
});

onEvent("answer_quiz2", "click", function( ) {
	 var answer_5 = getChecked("answer9");
	 var answer_6 = getChecked("answer5");
	 var answer_7 = getChecked("answer14");
	 var answer_8 = getChecked("answer18");
	 
	 if (answer_5 && !answer_6 && !answer_7 && !answer_8){
	   playSound("assets/ringtones-zelda-1.mp3");
	   activeUser.user_xp += 400;
	   pending_screen = "Quiz_3";
	   page("Quiz_3");
	   update();
	 } else{
	   playSound("assets/sonic-error-sound.mp3");
	 }
});

onEvent("answer_quiz_3", "click", function( ) {
	 var answer_9 = getChecked("answer6");
	 var answer_10 = getChecked("answer12");
	 var answer_11 = getChecked("answer15");
	 var answer_12 = getChecked("answer19");
	 
	 if (answer_11 && !answer_12 && !answer_10 && !answer_9){
	   playSound("assets/ringtones-zelda-1.mp3");
	   activeUser.user_xp += 400;
	   pending_screen = "Quiz_4";
	   page("Quiz_4");
	   update();
	 } else{
	   playSound("assets/sonic-error-sound.mp3");
	 }
});

onEvent("answer_quiz_4", "click", function( ) {
	 var answer_13 = getChecked("answer7");
	 var answer_14 = getChecked("answer11");
	 var answer_15 = getChecked("answer16");
	 var answer_16 = getChecked("answer20");
	 
	 if (answer_14 && !answer_13 && !answer_15 && !answer_16){
	   playSound("assets/ringtones-zelda-1.mp3");
	   activeUser.user_xp += 400;
	   pending_screen = "Quiz_5";
	   page("Quiz_5");
	   update();
	 } else{
	   playSound("assets/sonic-error-sound.mp3");
	 }
});

onEvent("answer_quiz_5", "click", function( ) {
	 var answer_17 = getChecked("answer17");
	 var answer_18 = getChecked("answer13");
	 var answer_19 = getChecked("answer8");
	 var answer_20 = getChecked("answer21");

	 if (answer_17 && !answer_18 && !answer_19 && !answer_20){
	   playSound("assets/ringtones-zelda-1.mp3");
	   activeUser.user_xp += 1000;
	   activeUser.finished = true;
	   pending_screen = "welcome_page_select_3";
	   update();
	   page("welcome_page_select_3");
	 } else{
	   playSound("assets/sonic-error-sound.mp3");
	 }
});

// level up continue
onEvent("continue_button", "click", function( ) {
	setScreen(pending_screen);
});

onEvent("button2", "click", function( ) {
  typer();
  showLoadingScreen();
	preLoad(Ssbu);
 
 // preload music
    setTimeout(function() {
    stopSound();
    setScreen("welcome_page_select_3");
    playSound("assets/untitled.mp3",true);
  }, 5000);
});
