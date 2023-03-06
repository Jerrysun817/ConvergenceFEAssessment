import React, { useEffect, useState } from 'react';
import './Photos.css'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

function Photos() {

    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const cachedData = localStorage.getItem('photos');  //caching photos to local storage
        if (cachedData) {
          setPhotos(JSON.parse(cachedData));
        } else {
          fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(data => {
              setPhotos(data);
              localStorage.setItem('photos', JSON.stringify(data));
            })
            .catch(error => console.log(error));
        }
      }, []);

    return (
        <div className='container'>
            {photos.map(photo => (
                <div key={photo.id}>
                <img src={photo.url} alt={photo.title} />
                <p>{photo.title}</p>
                </div>
            ))}
        </div>
        //change to scroll menu
    );
}

 
export default Photos;