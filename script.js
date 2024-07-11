// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('play-pause');
let myProgressBar = document.getElementById('myProgressBar');
let masterSongName = document.getElementById('masterSongName');
let ArtistName = document.getElementById('Artist');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let albumCover = document.getElementById('albumCover');
let shuffleButton = document.getElementById('shuffle');
let repeatButton = document.getElementById('repeat');
let volumeControl = document.getElementById('volumeControl');

let isShuffleOn = false;
let isRepeatOn = false;
let isPlayingAudio = false;

let songs = [
    { songName: "ฟังดูง่ายง่าย", filePath: "songs/1.mp3", coverPath: "covers/1.jpg",artist: "Silly Fools" },
    { songName: "เหนื่อย", filePath: "songs/2.mp3", coverPath: "covers/1.jpg",artist: "Silly Fools" },
    { songName: "Hey...", filePath: "songs/3.mp3", coverPath: "covers/2.jpg",artist: "Silly Fools" },
    { songName: "อย่าบอกว่ารัก", filePath: "songs/4.mp3", coverPath: "covers/2.jpg",artist: "Silly Fools" },
    { songName: "เพียงรัก", filePath: "songs/5.mp3", coverPath: "covers/2.jpg",artist: "Silly Fools" },
    { songName: "จงเรียกเธอว่านางพญา", filePath: "songs/6.mp3", coverPath: "covers/3.jpg",artist: "Silly Fools" },
    // { songName: "Why We Lose", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    // { songName: "Sky High", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    // { songName: "Symbolism", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    // { songName: "Heroes Tonight", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    // { songName: "Feel Good", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    // { songName: "My Heart", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
];

// Function to play the next song
const playNextSong = () => {
    if (isShuffleOn) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === songIndex);
        songIndex = newIndex;
    } else {
        songIndex = (songIndex + 1) % songs.length;
    }
    playSong(true);
};

// Function to play the previous song
const playPreviousSong = () => {
    if (isShuffleOn) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === songIndex);
        songIndex = newIndex;
    } else {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
    }
    playSong(true);
};

// Function to play a specific song
const playSong = (startOver = true) => {
    if (isPlayingAudio) return;
    isPlayingAudio = true;

    if (startOver || audioElement.src !== songs[songIndex].filePath) {
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        ArtistName.innerText =songs[songIndex].artist
        albumCover.src = songs[songIndex].coverPath;
        audioElement.load();
    }
    
    audioElement.play().then(() => {
        updatePlayPauseIcon(true);
        updatePlaylistIcon();
        isPlayingAudio = false;
    }).catch(error => {
        console.error("Error playing audio:", error);
        isPlayingAudio = false;
    });
};

// Function to pause the song
const pauseSong = () => {
    if (isPlayingAudio) return;
    audioElement.pause();
    updatePlayPauseIcon(false);
    updatePlaylistIcon();
};

// Function to update play/pause icon
const updatePlayPauseIcon = (isPlaying) => {
    if (isPlaying) {
        masterPlay.firstElementChild.classList.remove('fa-play');
        masterPlay.firstElementChild.classList.add('fa-pause');
    } else {
        masterPlay.firstElementChild.classList.remove('fa-pause');
        masterPlay.firstElementChild.classList.add('fa-play');
    }
};

// Function to toggle play/pause
const togglePlayPause = () => {
    if (audioElement.paused) {
        audioElement.play().then(() => {
            updatePlayPauseIcon(true);
        }).catch(error => {
            console.error("Error playing audio:", error);
        });
    } else {
        audioElement.pause();
        updatePlayPauseIcon(false);
    }
};

// Listen to Events
audioElement.addEventListener('timeupdate', () => {
    // Update Seekbar
    let progress = (audioElement.currentTime / audioElement.duration) * 100;
    myProgressBar.value = progress;
});

myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// Listen to the 'ended' event for playing the next song
audioElement.addEventListener('ended', () => {
    if (isRepeatOn) {
        playSong(true);
    } else {
        playNextSong();
    }
});

// Function to update playlist icon
const updatePlaylistIcon = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, i) => {
        if (i === songIndex && !audioElement.paused) {
            element.firstElementChild.classList.remove('fa-play');
            element.firstElementChild.classList.add('fa-pause');
        } else {
            element.firstElementChild.classList.remove('fa-pause');
            element.firstElementChild.classList.add('fa-play');
        }
    });
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const initializeSongItems = () => {
    let songItemContainer = document.querySelector('.songItemContainer');
    songItemContainer.innerHTML = ''; // Clear existing content

    songs.forEach((song, i) => {
        let songItem = document.createElement('div');
        songItem.classList.add('songItem');
        songItem.innerHTML = `
            <img src="${song.coverPath}" alt="${song.songName}">
            <span class="songName">${song.songName}</span>
            <span class="songlistplay">
                <span class="timestamp">00:00
                    <button id="${i}" class="far songItemPlay"><i class="fas fa-play"></i></button>
                </span>
            </span>
        `;
        songItemContainer.appendChild(songItem);

        // Load audio to get duration
        let tempAudio = new Audio(song.filePath);
        tempAudio.addEventListener('loadedmetadata', () => {
            songItem.querySelector('.timestamp').textContent = formatTime(tempAudio.duration);
        });

        // เพิ่ม event listener สำหรับทั้ง songItem
        songItem.addEventListener('click', (e) => {
            if (!e.target.closest('.songItemPlay')) {
                makeAllPlaysInactive();
                songIndex = i;
                playSong(true);  // เริ่มเล่นเพลงใหม่เมื่อคลิกที่ songItem
            }
        });

        // คงไว้สำหรับปุ่มเล่น/หยุด
        songItem.querySelector('.songItemPlay').addEventListener('click', (e) => {
            e.stopPropagation();  // ป้องกันการทริกเกอร์ event ของ parent
            makeAllPlaysInactive();
            if (songIndex === i && !audioElement.paused) {
                pauseSong();
            } else {
                songIndex = i;
                playSong(true);  // เริ่มเล่นเพลงใหม่เมื่อคลิกที่ปุ่มเล่น
            }
        });
    });
};

// Function to make all play icons inactive
const makeAllPlaysInactive = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.firstElementChild.classList.remove('fa-pause');
        element.firstElementChild.classList.add('fa-play');
    });
};

// Shuffle function
const toggleShuffle = () => {
    isShuffleOn = !isShuffleOn;
    shuffleButton.style.color = isShuffleOn ? '#fa586a' : '';
};

// Repeat function
const toggleRepeat = () => {
    isRepeatOn = !isRepeatOn;
    repeatButton.style.color = isRepeatOn ? '#fa586a' : '';
};

// Volume control function
const setVolume = () => {
    audioElement.volume = volumeControl.value / 100;
};

// Function to update progress bar and time display
const updateProgressBar = () => {
    let currentTime = audioElement.currentTime;
    let duration = audioElement.duration;
    let progress = (currentTime / duration) * 100;

    // Update progress bar
    myProgressBar.value = progress;

    // Update current time display
    document.getElementById('currentTimeDisplay').textContent = formatTime(currentTime);
    document.getElementById('durationDisplay').textContent = formatTime(duration);
};


// Initialize song items
initializeSongItems();

// Event listeners for controls
masterPlay.addEventListener('click', togglePlayPause);
audioElement.addEventListener('timeupdate', updateProgressBar);
document.getElementById('next').addEventListener('click', playNextSong);
document.getElementById('previous').addEventListener('click', playPreviousSong);
shuffleButton.addEventListener('click', toggleShuffle);
repeatButton.addEventListener('click', toggleRepeat);
volumeControl.addEventListener('input', setVolume);
