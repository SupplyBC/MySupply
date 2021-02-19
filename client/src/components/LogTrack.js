import React , { Component} from 'react'

class LogTrack extends Component {

    render() {
        return(
            <div>
                <h1> CREATE TRACKING RECORD </h1>
                <p style={{color: '#666'}}> (admin-only feature) </p>
                <textarea rows='10' cols='110'> e.g STATUS: NORMAL </textarea>
            </div>
        );
    }
}

export default LogTrack