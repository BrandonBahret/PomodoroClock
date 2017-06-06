$(document).ready(function(){
  var SECONDS_PER_MINUTE = 60;
  
  var sessionTime = 25; 
  var breakTime = 5;
  var timeSettingsEnabled = true;
  var timeRemaining = sessionTime * SECONDS_PER_MINUTE;
  var playing = false;
  var bell = new Audio('http://www.freesfx.co.uk/rx2/mp3s/9/10604_1376407711.mp3');
  
  function isDisabled(view){
    return view.prop("disabled") || view.hasClass("disabled");
  }
  
  function toggleDisabled(view){
    if(view.prop("disabled")){
      view.removeAttr("disabled");
    }
    else{
      view.prop("disabled", true);
    }
  }
  
  function toggleTimeSettingEnableState(){
    timeSettingsEnabled = !timeSettingsEnabled;
    toggleDisabled($("#dec-session-time"));
    toggleDisabled($("#inc-session-time"));
    toggleDisabled($("#break-minutes-setting"));
    toggleDisabled($("#dec-break-time"));
    toggleDisabled($("#inc-break-time"));
    toggleDisabled($("#session-minutes-setting"));
    $("#session-switch").toggleClass("disabled");
  }
  
  function toggleBackground(isBreakMode){
    if(isBreakMode){
      $("body").addClass("break");
      $("body").removeClass("working");
    }
    else{
      $("body").addClass("working");
      $("body").removeClass("break");
    }
  }
  
  function getTargetSessionTime(){
    var isBreakMode = $("#session-switch-checkbox").is(':checked');
    return (isBreakMode ? breakTime : sessionTime) * SECONDS_PER_MINUTE;
  }
   
  function updateClockDisplay(time){
    var minutes = Math.floor(time / SECONDS_PER_MINUTE);
    var seconds = time - (minutes * SECONDS_PER_MINUTE);
    seconds = ("0" + seconds).slice(-2);
    $("#clock-display-min").html(minutes);
    $("#clock-display-sec").html(seconds);
  }
  
  setInterval(function(){
    if(playing) updateClockDisplay(--timeRemaining);
    if(timeRemaining === 0){
      var isBreakMode = $("#session-switch-checkbox").is(':checked');
      $("#session-switch-checkbox").prop("checked", !isBreakMode);
      toggleBackground(!isBreakMode)
      timeRemaining = getTargetSessionTime();
      bell.play();
    }
  }, 1000);
    
  function playSession(){
    playing = true;
    toggleTimeSettingEnableState();
    timeRemaining = getTargetSessionTime(); 
    
    $("#clock-display").removeClass("disabled");
    $("#clock-play-button").removeClass("fa-play");
    $("#clock-play-button").addClass("fa-stop");
  }
  
  function stopSession(){
    toggleTimeSettingEnableState();
    timeRemaining = getTargetSessionTime();
    updateClockDisplay(timeRemaining);
    playing = false;
    $("#clock-display").addClass("disabled");
    $("#clock-play-button").removeClass("fa-stop");
    $("#clock-play-button").addClass("fa-play");
  }
  
  //region [---- events ----]
  
  $("#clock-play-button").on("click", function(){
    if(!playing){
      playSession();
    }
    else {
      stopSession();
    }
  });
  
  $("#session-switch").on("click", function(e){
    if(isDisabled($(this))){
      e.preventDefault();
    }
    else {
      var isChecked = $("#session-switch-checkbox").is(':checked');
      toggleBackground(isChecked);
      updateClockDisplay(getTargetSessionTime());
    }
  });
  
  //region session-time-settings events
  $("#dec-session-time").on("click", function(){
    if(timeSettingsEnabled && sessionTime > 1){
      $("#session-minutes-setting").html(--sessionTime);
      updateClockDisplay(getTargetSessionTime());
    }
  });
  $("#inc-session-time").on("click", function(){
    if(timeSettingsEnabled && sessionTime < 99) {
      $("#session-minutes-setting").html(++sessionTime);
      updateClockDisplay(getTargetSessionTime());
    }
  });
  //endregion -- end --
  
  //region break-time-settings events
  $("#dec-break-time").on("click", function(){
    if(timeSettingsEnabled && breakTime > 1) {
      $("#break-minutes-setting").html(--breakTime);
      updateClockDisplay(getTargetSessionTime());
    }
  });
  $("#inc-break-time").on("click", function(){
    if(timeSettingsEnabled && breakTime < 99) {
      $("#break-minutes-setting").html(++breakTime);
      updateClockDisplay(getTargetSessionTime());
    }
  });
  //endregion -- end --
  
  //endregion [---- events ----]
    
});