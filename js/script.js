let currentSong = new Audio();
let songs = [];
let currFolder;

function secondsToMinutesSeconds(seconds) {
  // Ensure input is a positive number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate minutes and remaining seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds with leading zeros
  var formattedMinutes = String(minutes).padStart(2, "0");
  var formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Combine formatted minutes and seconds
  var formattedTime = formattedMinutes + ":" + formattedSeconds;

  return formattedTime;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `<li>
              <img class="invert" src="images/music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Song Artist</div>
              </div>
              <div class="flex justify-center items-center playNow">
                <span>Play Now</span>
                <svg class="invert" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="/icons/play-circle-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
                  <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="2"></circle>
                  <path d="M9.5 16V8L16 12L9.5 16Z" stroke="#000000" stroke-width="2" stroke-linejoin="round"></path>
                  </svg>
              </div>
  </li>`;
  }

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      let song = e.querySelector(".info").firstElementChild.innerHTML;
      playMusic(song);
    });
  });
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="/icons/pause-stroke-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
  <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="#000000" stroke-width="2"></path>
  <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="#000000" stroke-width="2"></path>
  </svg>`;
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
      <div class="play invert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          class="injected-svg"
          data-src="/icons/play-circle-stroke-sharp.svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          role="img"
          color="#000000"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#000000"
            stroke-width="2"
          ></circle>
          <path
            d="M9.5 16V8L16 12L9.5 16Z"
            stroke="#000000"
            stroke-width="2"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
      <img
        src="/songs/${folder}/cover.jpeg"
        alt=""
      />
      <h4 class="pt-1">${response.title}</h4>
      <p class="pt-1">
      ${response.description}
      </p>
    </div>`;
    }
  }
  //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
async function main() {
  //Get the list of all songs
  await getSongs("songs/cs");
  playMusic(songs[0], true);

  //Display all the albums on the page
  displayAlbums();

  //Attach an Event Listener to play song, next and prev buttons.
  playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="/icons/pause-stroke-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
      <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="#000000" stroke-width="2"></path>
      <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="#000000" stroke-width="2"></path>
      </svg>`;
    } else {
      currentSong.pause();
      playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="/icons/play-circle-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
      <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="2"></circle>
      <path d="M9.5 16V8L16 12L9.5 16Z" stroke="#000000" stroke-width="2" stroke-linejoin="round"></path>
      </svg>`;
    }
  });
  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an Event Listener to seekBar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add an Event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add an Event listener for closing hamburger
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add an Event Listener for next and previous Btn
  prevBtn.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });
  nextBtn.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  //Add an Event Listener to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //Add an Event listener to mute the volume of songs
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg","mute.svg");
      currentSong.volume = 0;
      document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace("mute.svg","volume.svg");
      currentSong.volume = .1;
      document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 10;

    }
  })
}

main();
