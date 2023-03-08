import React, { useEffect, useState } from 'react';
import './Photos.css'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { CCarouselItem } from '@coreui/react';

function Photos() {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const cachedData = localStorage.getItem('photos');
    //check if the photos are already cached
    if (cachedData) {
      //parse the cached data and set state variable to cached photos
      setPhotos(JSON.parse(cachedData));
    } else {
      //fetch freom API
      fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(data => {
          setPhotos(data);
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
    const shuffledPhotos = recurShuffle([...photos]);
    setPhotos(shuffledPhotos);
  };

  return (
    <div>
      <Carousel showArrows={true} infiniteLoop={true} showIndicators={false} swipeable={true} showThumbs={false} centerMode={true} centerSlidePercentage={50}>
        {photos.map(photo => (
          <CCarouselItem key={photo.id}>
            <div className='photo_container'>
              <img src={photo.url} alt={photo.title} />
              <p>{photo.title}{photo.id}</p>
            </div>
          </CCarouselItem>
        ))}
      </Carousel>
      <button className='shuffle_button' onClick={shufflePhotos}>Press To Reorder Photos</button>
    </div>

    //change to scroll menu
  );
}


export default Photos;