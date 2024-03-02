import musicDb from "./music-db/music-db.js";


// So basically saying is service worker stands in between the client and server and the network so that the user can make
// use of tha app even if they are offline because service worker is used to cache the data and the things like index.html or images...

// registering the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
      .then(registration => {})
      .catch(error => {
          console.error('Service Worker registration failed:', error);
      });
}

document.getElementById('addSong').addEventListener('click', addSong);

//Open the database
musicDb.open()
  .then(()=>{
    //This is used to get data from the firebase database
    musicDb.getAll().then((songs)=>{
      displaySongs(songs)
    })
  })
  .catch((error)=>{
    console.log("Error Occurred: ", error)
})



//Function to add new song to the firestore database
function addSong() {
  const title = document.getElementById('title').value;
  const artist = document.getElementById('artist').value;
  


  const titleError = document.getElementById('titleError');
  const artistError = document.getElementById('artistError');

  // Reset error messages when there is no error need to remove the error message
  titleError.textContent = '';
  artistError.textContent = '';

  let hasError = false;

  if (!title) {
    titleError.textContent = 'Title is required';
    titleError.style.color = 'red';
    hasError = true;
  } 

  if (!artist) {
    artistError.textContent = 'Artist is required';
    artistError.style.color = 'red';
    hasError = true;
  }

  if(hasError == false){
    musicDb.add(title, artist, 1);
  }

  if (hasError) {
    return;
  }

  document.getElementById('title').value = '';
  document.getElementById('artist').value = '';
}


function displaySongs(songList) {
  const songsListContainer = document.getElementById('songsListContainer');
  songsListContainer.innerHTML = '';

  if (songList.length === 0) {
      songsListContainer.innerHTML = `<div class="music-not-found">No Music found in the database</div>`;
      return;
  }

  songList.forEach(music => {
      const songElementDiv = document.createElement('div');
      const likeContainer = document.createElement('div');

      songElementDiv.className = 'song-element';
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'space-between';

      songElementDiv.style.marginTop = '5%';
      songElementDiv.style.marginBottom = '1%';
      songElementDiv.style.marginLeft = '5%';
      songElementDiv.style.marginRight = '5%';
      songElementDiv.style.backgroundColor = 'white';
      songElementDiv.style.border = 'none';
      songElementDiv.style.border = '1px solid #d1d1d1';
      songElementDiv.style.paddingTop = '2%';
      songElementDiv.style.paddingLeft = '2%';
      songElementDiv.style.paddingBottom = '3%';
      songElementDiv.innerHTML = `<strong>${music.title}</strong><br>${music.singer} `;
      
      likeContainer.innerHTML = `<strong>Likes: ${music.likes}</strong><br>`;

      songElementDiv.append(likeContainer);

      //Include the remove button
      const buttonRemove = document.createElement('button');
      buttonRemove.className = 'remove';
      buttonRemove.textContent = 'Remove';
      buttonRemove.style.backgroundColor = 'red';
      buttonRemove.style.color = 'white';
      buttonRemove.style.border = '1px solid black';
      buttonRemove.style.borderRadius = '5px';
      buttonRemove.style.padding = '5px';
      buttonRemove.style.marginTop = '2%'
      buttonRemove.addEventListener('click', () => {
          musicDb.delete(music.id)
              .then(() => {
                  songElementDiv.remove();
              }).catch((error) => {
                  console.log('Error occurred when deleting: ', error);
              });
      });

      //Include the like button
      const likeButton = document.createElement('button');
      likeButton.className = 'addlike';
      likeButton.textContent = `+1 Like`;
      likeButton.style.backgroundColor = '#1e90ff';
      likeButton.style.color = 'white';
      likeButton.style.border = '1px solid black';
      likeButton.style.borderRadius = '5px';
      likeButton.style.padding = '5px';
      likeButton.style.marginTop = '2%'
      likeButton.style.marginRight = '2%';
      likeButton.addEventListener('click', () => {
        musicDb.addLike(music.id,music.likes)
         .then(()=>{
          likeContainer.innerHTML = `Likes: <strong>${music.likes++ + 1}</strong><br>`;
         }).catch((error)=>{console.log('Error Occurred when add like: ', error)});
      });
      
      buttonContainer.appendChild(buttonRemove);
      buttonContainer.appendChild(likeButton);
      songElementDiv.appendChild(buttonContainer);

      songsListContainer.appendChild(songElementDiv);
      
  });
}