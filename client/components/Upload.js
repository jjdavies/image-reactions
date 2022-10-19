import React from 'react';
import { FileUploader } from 'react-drag-drop-files';

export default function Upload(props) {
  const fileTypes = ['PNG', 'JPG', 'JPEG'];

  const handleChange = (file) => {
    var imageObjectURL = URL.createObjectURL(file);

    var formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('uploader', 'James');
    formData.append('uploaderid', '001');
    formData.append('reactions', '');

    var options = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    var img = new Image();
    img.addEventListener('load', () => {
      console.log(img.width, img.height);
      if (img.width > img.height) formData.append('landscape', 'true');
      if (img.width <= img.height) formData.append('landscape', 'false');
      fetch('/image', options).then((result) =>
        result.json().then(() => {
          props.refreshImages();
        }),
      );
    });
    img.src = imageObjectURL;
  };

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
        }
      />
    </div>
  );
}
