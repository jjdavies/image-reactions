import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Upload from '../components/Upload';
// import 'react-tabs/style/react-tabs.css';

import Image from '../components/Image';

function Homepage(){

    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState('')

    useEffect(()=>{
        getImages();
    }, [])
    
    const getImages = async() =>{
        fetch('/image/0')
        .then(res => {
            res.json().then(data =>{
                setImages(data.images)
            })
        })

    }

    const newSelection = (imageid) =>{
        console.log(imageid)
        setSelectedImage(imageid)
    }

    return (
        <div>
            <Tabs>
                <TabList>
                    <Tab>Browse</Tab>
                    <Tab>Upload</Tab>
                </TabList>
                <TabPanel>
                    <h1>Browse</h1>
                    <div className="images-container">
                            {images.map(img =>(
                                <Image key={img.fileid} data={img} selected={selectedImage} newSelection={newSelection} />
                            ))}
                    </div>
                </TabPanel>
                <TabPanel>
                    <Upload />
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default Homepage