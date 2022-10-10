import React from 'react'
import { FileUploader } from 'react-drag-drop-files';

export default function Upload() {

    const fileTypes = ["PNG", "JPG", "JPEG"];

    const handleChange = (file) =>{

        var imageObjectURL = URL.createObjectURL(file);

        var formData = new FormData();
        formData.append("image", file, file.name);
        formData.append("uploader", "James");
        formData.append("uploaderid", "001");
        formData.append("reactions", "");
        
        var options = {
            method:'POST',
            body:formData,
            redirect:'follow'
        };
        
        var img = new Image();
        img.addEventListener("load", ()=>{
            console.log(img.width, img.height)
            if (img.width > img.height) formData.append("landscape", "true")
            if (img.width <= img.height) formData.append("landscape", "false")
            fetch("/image", options)
            .then(result => result.json().then(data => console.log(data)))
        })
        img.src = imageObjectURL;

        // fs.readFile(file.path, (err, content)=>{
        //     var data = JSON.parse(content);
        //     console.log(data)
        // })
        // var objURL = URL.createObjectURL(file)
        // fetch(objURL).then((r)=>{
        //     r.json().then(result =>{
        //         // setSaved([...saved, result.activity])
        //     })
        // })
    }

  return (
    <div>
        <FileUploader 
            handleChange={handleChange} 
            name="file" 
            types={fileTypes} 
            multiple={false} 
            children={
                <div className="custom-drop">
                    <div className="drop-space">Drag Image here or Click to Add</div>
                </div>
            }/>
    </div>
  )
}
