import React, { useState } from 'react';
import SpineFull from '../components/SpineFull';

export default function Image(props) {
  // const [imageClass, setImageClass] = useState('image');
  // useEffect(()=>{
  //     setImageClass(props.selected === props.data._id ? 'image select' : 'image')
  // }, props.selected)

  const imageClass =
    props.selected === props.data._id ? 'image select' : 'image';

  const [upvote, setUpvote] = useState(props.data.upvote);
  const [downvote, setDownvote] = useState(props.data.downvote);
  const [votescore, setVoteScore] = useState(props.data.votescore);

  const votescoreColor = votescore > 0 ? 'green' : 'red';

  const imageDivClass = props.data.landscape ? 'landscape' : '';

  const imageClick = () => {
    props.newSelection(props.data.id);
  };

  const makeUpvote = async () => {
    console.log(props.data.id);
    fetch(`/image/${props.data.id}/upvote/`, { method: 'PUT' }).then(
      (res, err) => {
        if (err) return console.log(err);
        res.json().then((data) => {
          setUpvote(data.upvote);
          setVoteScore(data.votescore);
        });
      },
    );
  };

  const makeDownvote = () => {
    fetch(`/image/${props.data.id}/downvote/`, { method: 'PUT' }).then(
      (res, err) => {
        if (err) return console.log(err);
        res.json().then((data) => {
          setDownvote(data.downvote);
          setVoteScore(data.votescore);
        });
      },
    );
  };

  return (
    <div className={imageDivClass}>
      <img
        className={imageClass}
        src={`/image/${props.data.fileid}/res/`}
        alt="loading"
        onClick={imageClick}
      />

      <div className="image-react">
        <div className="react-button" onClick={makeUpvote}>
          Upvote {upvote}
        </div>
        <div
          className="react-button"
          style={{
            fontWeight: 'bold',
            color: votescore === 0 ? 'black' : votescoreColor,
          }}
        >
          {votescore}
        </div>
        <div className="react-button" onClick={makeDownvote}>
          Downvote {downvote}
        </div>
        {props.selected === props.data._id && (
          <>
            <div className="reaction-modal">
              <div className="image-space">
                <div className="image-container">
                  <img
                    className="in-modal"
                    src={`/image/${props.data.fileid}/res/`}
                    alt="loading"
                  />
                </div>

                <div>
                  <SpineFull />
                </div>
              </div>
              <div className="spine-options">
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
                <div className="spine-option"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
