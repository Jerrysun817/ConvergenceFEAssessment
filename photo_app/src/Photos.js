import React, { useEffect, useState } from 'react';
import './Photos.css'
import Loading from "./Loading.js"

function Photos() {

  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const cachedData = localStorage.getItem('photos');
    //check if the photos are already cached
    if (cachedData) {
      //parse the cached data and set state variable to cached photos
      console.log("loading from local storage");
      setPhotos(JSON.parse(cachedData));
      setTimeout(()=>{
          setLoading(false);
      },2000);
      
    } else {
      //fetch freom API
      console.log("fetching Photos");
      fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(data => {
          setPhotos(data);
          setTimeout(()=>{
            setLoading(false);
        },2000);
          //store the feched photos to localStorage
          localStorage.setItem('photos', JSON.stringify(data));

          data.forEach(photo => {
            //preloading to local cache
            const img = new Image();
            img.src = photo.url;
          });
        })
        .catch(error => console.log(error));
    }

    const handleKeyPress = (event) => {
      // check if r is pressed 
      if (event.key === "r") {
        window.alert('LocalStorage Cleared');
        clearLocalStorage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const clearLocalStorage = () => {
    console.log("localStorage cleared");
    localStorage.clear();
  }

  // recursive function to shuffle photos
  const recurShuffle = (arr) => {

    //base case for 1 photo and no photos
    if (arr.length === 0 || arr.length === 1) {
      return arr;
    }

    //generate random index within the length of arr
    const randomIndex = Math.floor(Math.random() * arr.length);

    //remove the photo of randomIndex from arr and add it to tempPhoto
    const [tempPhoto] = arr.splice(randomIndex, 1);

    //recursive call to the rest of the array
    return [...recurShuffle(arr), tempPhoto];
  }

  const shufflePhotos = () => {
    setLoading(true);
    const shuffledPhotos = recurShuffle([...photos]);
    setTimeout(() => { setLoading(false); }, 1000);
    setPhotos(shuffledPhotos);
  };

  const nextPhoto = () => {
    //start animation
    document.querySelector('.container').classList.add('next');
    setTimeout(() => {
      //end animation and swap photos
      const newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
      const img = new Image();
      img.src = photos[newIndex].url;
      img.onload = () => {
        document.querySelector('.container').classList.remove('next');
        setCurrentIndex(newIndex);
      };
    }, 1000);
  };

  const prevPhoto = () => {
    //start animation
    document.querySelector('.container').classList.add('prev');
    setTimeout(() => {
      //end animation and swap photos
      const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
      const img = new Image();
      img.src = photos[newIndex].url;
      img.onload = () => {
        document.querySelector('.container').classList.remove('prev');
        setCurrentIndex(newIndex);
      };
    }, 1000);
  };

  //calculate the nextIndex that will be used in when using the slice function
  const nextIndex = (index) => {
    if (index === photos.length - 1) {
      return 0;
    }
    return index + 1;
  }

  const renderContent = (
    <>
      <div className='container'>
        {photos.slice(currentIndex, currentIndex + 1).map(photo => (
          <div key={photo.id} className='photo_container' id='left'>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
        {photos.slice(nextIndex(currentIndex), nextIndex(currentIndex) + 1).map(photo => (
          <div key={photo.id} className='photo_container' id='midleft'>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
        {photos.slice(nextIndex(nextIndex(currentIndex)), nextIndex(nextIndex(currentIndex)) + 1).map(photo => (
          <div key={photo.id} className='photo_container' id='mid'>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.title}</p>
            <div className='carousel_buttons'>
              <button className='prev_button button' onClick={prevPhoto}>&#60;</button>
              <button className='next_button button' onClick={nextPhoto}>&#62;</button>
            </div>
          </div>
        ))}
        {photos.slice(nextIndex(nextIndex(nextIndex(currentIndex))), nextIndex(nextIndex(nextIndex(currentIndex))) + 1).map(photo => (
          <div key={photo.id} className='photo_container' id='midright'>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
        {photos.slice(nextIndex(nextIndex(nextIndex(nextIndex(currentIndex)))), nextIndex(nextIndex(nextIndex(nextIndex(currentIndex)))) + 1).map(photo => (
          <div key={photo.id} className='photo_container' id='right'>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>
      <button className='shuffle_button button' onClick={shufflePhotos}>Reorder</button>
    </>
  );

  return (
    <>
      {isLoading ? <Loading /> : renderContent}
    </>
  );
}


export default Photos;