import React from 'react'
import './Project.css'
import img1 from '../../assets/p1.avif';
import img2 from '../../assets/p2.avif';
import img3 from '../../assets/p3.jpeg';
import img4 from '../../assets/p4.jpeg';

const Project = () => {
  return (
    <div className='ProjectDiv'>
            <div className="left">
                <img src={img1} alt="Image of Gordon Pointe" />
            </div>
        <div className="right">
            <div className="title">FEATURED PROPERTY</div>
            <div className="subtitle">There is nothing like it – anywhere. This is a once-in-a-lifetime opportunity to possess a natural oasis located in the exclusive neighborhood of Port Royal, the ultimate setting for creating a lifestyle of custom luxury. </div>
            <div className="contact-btn">Contact Us</div>
        </div>
        <div className="gallery">
            <div className="photo1">
                <img src={img2} alt="House With Sea Shore" />
                <div className="tined">
                    <div>House With Sea Shore</div> 
                    </div>
            </div>
            <div className="photo2">
                <img src={img3} alt="Royal House"/>
                <div className="tined">
                    <div>Royal House</div>
                    
                    </div>
                </div>
            <div className="photo3">
                <img src={img4} alt="Modern House"/>
                <div className="tined">
                    <div>Modern House</div>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default Project