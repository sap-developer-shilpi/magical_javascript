// get our Elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll('.player__slider');

//build our functions

function togglePlay(){
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton(){
 const icon = this.paused ? '►' : '❚ ❚';
 toggle.textContent = icon;
}

function skip(){
  console.log(this.dataset);
 video.currentTime+= parseFloat(this.dataset.skip);
}
function updateRange(){
  video[this.name]= this.value;
}
function handleProgress(){
 const percentage = (video.currentTime / video.duration) * 100;
 progressBar.style.flexBasis = `${percentage}%`;
}

function scrub(e){
  const scrubTime = (e.offsetX/ progress.offsetWidth ) * video.duration;
  video.currentTime = scrubTime;
}
//hook up the event listners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', updateRange));
ranges.forEach(range => range.addEventListener('mousemove', updateRange));

video.addEventListener('timeupdate', handleProgress);
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown',() => mousedown = true);
progress.addEventListener('mouseup',() => mousedown= false);
