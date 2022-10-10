import React, { useEffect, useState } from 'react'
import { isPropertySignature } from 'typescript';

export default function Image(props) {

    // const [imageClass, setImageClass] = useState('image');

    // useEffect(()=>{
    //     setImageClass(props.selected === props.data._id ? 'image select' : 'image')
    // }, props.selected)

    const imageClass = props.selected === props.data._id ? 'image select' : 'image'

    const [upvote, setUpvote] = useState(props.data.upvote);
    const [downvote, setDownvote] = useState(props.data.downvote);
    const [votescore, setVoteScore] = useState(props.data.votescore);

    const votescoreColor = votescore > 0 ? 'green' : 'red'

    const imageDivClass = props.data.landscape ? 'landscape' : '';

    const imageClick = () =>{
        props.newSelection(props.data._id);
    }

    const makeUpvote = async() =>{
        fetch(`/image/upvote/${props.data._id}`, { method:'PUT' })
        .then((res, err)=>{
            if (err) return console.log(err)
            res.json().then(data =>{
                    setUpvote(data.upvote);
                    setVoteScore(data.votescore);
            })
        })
    }

    const makeDownvote = () =>{
        fetch(`/image/downvote/${props.data._id}`, { method:'PUT' })
            .then((res, err)=>{
                if (err) return console.log(err)
                res.json().then(data =>{
                        setDownvote(data.downvote);
                        setVoteScore(data.votescore);
                })
            })
    }

  return (
    <div className={imageDivClass}>
        <img className={imageClass} src={`/image/res/${props.data.fileid}`} alt="loading" onClick={imageClick} />
        {/* <img className={props.selected === props.data._id ? 'image in-modal' : 'image'} src={`/image/res/${props.data.fileid}`} alt="loading" style={{display: props.selected === props.data._id ? '' : ''}}/> */}
        
        <div className="image-react">
            <div className="react-button" onClick={makeUpvote}>Upvote {upvote}</div>
            <div className="react-button" style={{fontWeight:'bold', color:votescore === 0 ? 'black' : votescoreColor}}>{votescore}</div>
            <div className="react-button" onClick={makeDownvote}>Downvote {downvote}</div>
            {/* <div className="reaction-modal"></div> */}
        </div>
        
    </div>
  )
}
