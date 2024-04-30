import SourcesModal from './SourcesModal.js';

import likeBtnImage from './Like Icon.png';
import botProfile from './Rosie Bot Profile.png';
import userImage from './profile photo.png';
import dislikeBtnImage from './Dislike Icon.png';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReactMarkdown from 'react-markdown';


const Message = ({ message, index, likes, setLikes, dislikes, setDislikes }) => {
    // State to control the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to toggle the modal visibility
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div key={index} className={message.role}>
            <img src={message.role === 'user' ? userImage : botProfile} alt={message.role} className='profImage' />
            {message.role === 'bot' && message.sources && message.sources.length > 0 && (
                <>
                    <Button
                        id='source_button'
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={<InsertDriveFileIcon />}
                        onClick={toggleModal} // Toggle modal on click
                    >
                        Sources
                    </Button>
                    <SourcesModal
                        isOpen={isModalOpen}
                        toggleModal={toggleModal}
                        sources={message.sources} // Pass the sources prop here
                    />
                </>
            )}
            
            <ReactMarkdown className={message.role === 'user' ? 'user-text' : 'bot-text'}>{message.text}</ReactMarkdown>
            {message.role === 'bot' && (
                <>
                <button className='feedbackBtn' onClick={() => setLikes([...likes, index])}>
                    <img src={likeBtnImage} alt='Like' />
                </button>
                <button className='feedbackBtn' onClick={() => setDislikes([...dislikes, index])}>
                    <img src={dislikeBtnImage} alt='Dislike' />
                </button>
                </>
            )}
            <hr className='message-divider' />
        </div>
    );

};

export default Message;
