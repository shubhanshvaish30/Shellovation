import React from 'react';
import './Flash.css'

function Flash({success,error}){
    return (
        <div>
            {success && success.length > 0 && (
                <div id="success-alert" className="alert alert-success">
                    <strong>{success}</strong>
                    <button type="button" className="btn-close" aria-label="Close">&times;</button>
                </div>
            )}
            {error && error.length > 0 && (
                <div id="error-alert" className="alert alert-danger">
                    <strong>{error}</strong>
                    <button type="button" className="btn-close" aria-label="Close">&times;</button>
                </div>
            )}
        </div>
    );
};

export default Flash;