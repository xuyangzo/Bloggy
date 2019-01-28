import React from "react";

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="input-group">
                <input type="text" className="form-control" aria-label="Text input with dropdown button" />
                    <div className="input-group-append">
                        <button id="searchButton" className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Author</a>
                            <a className="dropdown-item" href="#">Title</a>
                            <a className="dropdown-item" href="#">Subtitle</a>
                            <div role="separator" className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">Search All</a>
                        </div>
                    </div>
            </div>
        );
    }
}