import React from "react";
import axios from "axios";
export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        };
    }
    render() {
        return (
            <form class="form-inline my-2 my-lg-0">
                <div className="input-group mr-sm-2">
                    <input class="form-control" type="search" onKeyDown={this.onKeyPressed} aria-label="Text input with dropdown button" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                        <div className="dropdown-menu">
                            <a className="dropdown-item" onClick={() => this.onClick("author")} href="#">Search by Author</a>
                            <a className="dropdown-item" href="#" onClick={() => this.onClick("title")}>Search by Title</a>
                            <a className="dropdown-item" href="#" onClick={() => this.onClick("subtitle")}>Search by Subtitle</a>
                            <div role="separator" class="dropdown-divider" />
                            <a className="dropdown-item" href="#" onClick={() => this.onClick("all")}>Search All</a>
                        </div>
                    </div>
                </div>
                <button class="btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
        );
    }
    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
    }
    onClick = search => {

        const searchType = search;
        const keyword = this.state.inputValue;
        axios
            .get(`/api/search/${searchType}/${keyword}`)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                this.setState({ errors: err.response.data });
                console.log(err.response.data);
            });
    };

    onKeyPressed = e => {
        if (e.keyCode === 13) {
            const searchType = "all";
            const keyword = this.state.inputValue;
            axios
                .get(`/api/search/${searchType}/${keyword}`)
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    this.setState({ errors: err.response.data });
                    console.log(err.response.data);
                });
        }
    };


}

