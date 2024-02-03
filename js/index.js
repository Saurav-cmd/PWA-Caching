
// So basically saying is service worker stands in between the client and server and the network so that the user can make
// use of tha app even if they are offline because service worker is used to cache the data and the things like index.html or images...

// registering the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
      .then(registration => {
          console.log('Service Worker registered successful:', registration);
      })
      .catch(error => {
          console.error('Service Worker registration failed:', error);
      });
}


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

  if (hasError) {
    return;
  }

  const songElementDiv = document.createElement('div');
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
  songElementDiv.innerHTML = `<strong>${title}</strong><br>${artist}`;

  document.getElementById('songsListContainer').appendChild(songElementDiv);

  document.getElementById('title').value = '';
  document.getElementById('artist').value = '';
}
