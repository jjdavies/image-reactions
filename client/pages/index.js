import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Upload from '../components/Upload';
// import 'react-tabs/style/react-tabs.css';

import Image from '../components/Image';

function Homepage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const limit = 0;
    fetch(`/image?limit=${limit}`).then((res) => {
      res.json().then((data) => {
        setImages(data.images);
      });
    });
  };

  const newSelection = (imageid) => {
    console.log(imageid);
    setSelectedImage(imageid);
  };

  const refreshImages = () => {
    getImages();
  };

  const bgClick = (e) => {
    if (e.target.id === 'bg-div') {
      setSelectedImage('');
    }
  };

  return (
    <>
      {/* <head>
                <title>Image Reactions | Don't Underreact!</title>
            </head> */}
      {/* <Script src='/spine-webgl.js' /> */}
      <div id="bg-div" onClick={bgClick}>
        {/* <Tabs>
          <TabList>
            <Tab>Browse</Tab>
            <Tab>Upload</Tab>
          </TabList>
          <TabPanel> */}
        <Upload refreshImages={refreshImages} />
        <h1>Browse</h1>
        <div className="images-container">
          {images.map((img) => (
            <Image
              key={img.fileid}
              data={img}
              selected={selectedImage}
              newSelection={newSelection}
            />
          ))}
        </div>
        {/* </TabPanel>
          <TabPanel>
          </TabPanel>
        </Tabs> */}
      </div>
    </>
  );
}

export default Homepage;
