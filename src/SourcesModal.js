import React from 'react';
import './SourcesModal.css'; // Make sure to import the corresponding CSS

const SourcesModal = ({ isOpen, toggleModal, sources }) => {
    if (!isOpen) return null;

    return (
        <div className="modal" onClick={toggleModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-button" onClick={toggleModal}>&times;</span>
                <h3>Sources</h3>
                <ul>
                    {sources.map((source, index) => (
                        <li key={index}>
                            <a href={source.href} target="_blank" rel="noopener noreferrer">
                                {source.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SourcesModal;
