async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}

async function main() {
  //Get the list of all songs
  let songs = await getSongs();

  let songUl = document.querySelector('.songList').getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML += `<li>
                <img class="invert" src="images/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20"," ")}</div>
                  <div>Song Artist</div>
                </div>
                <div class="flex justify-center items-center playNow">
                  <span>Play Now</span>
                  <svg class="invert" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="/icons/play-circle-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
                    <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="2"></circle>
                    <path d="M9.5 16V8L16 12L9.5 16Z" stroke="#000000" stroke-width="2" stroke-linejoin="round"></path>
                    </svg>
                </div>
    </li>`
  }

  //Play the first song
  var audio = new Audio(songs[0]);
//   audio.play();
  audio.addEventListener("loadeddata", () => {
    // The duration variable now holds the duration (in seconds) of the audio clip
    console.log(audio.duration, audio.currentSrc, audio.currentTime);

  });
}

main();
