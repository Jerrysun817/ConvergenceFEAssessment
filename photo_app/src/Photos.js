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
      setPhotos(JSON.parse(cachedData));
      setLoading(false);
    } else {
      //fetch freom API
      fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(data => {
          setPhotos(data);
          setLoading(false);
          //store the feched photos to localStorage
          localStorage.setItem('photos', JSON.stringify(data));
        })
        .catch(error => console.log(error));
    }
  }, []);

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
    setCurrentIndex(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  }

  const prevPhoto = () => {
    setCurrentIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  }

  const renderContent = (
    <>
      <div className='container'>
        {photos.slice(currentIndex, currentIndex + 5).map(photo => (
          <div key={photo.id} className='photo_container'>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>
      <div className='carousel_buttons'>
        <button className='prev_button' onClick={prevPhoto}>Prev</button>
        <button className='next_button' onClick={nextPhoto}>Next</button>
      </div>
      <button className='shuffle_button' onClick={shufflePhotos}>Press To Reorder Photos</button>
    </>
  );

  return (
    <>
      {isLoading ? <Loading /> : renderContent}
    </>
  );
}


export default Photos;