import React from "react";
import axios from "axios";
export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            resultList: []
        };
    }
    handleChange = e =>{
        // e.preventDefault();
        const searchType = "all";
        const keyword = e;
        if(e.trim() == "" || e == undefined){
            this.setState({resultList:[]});
        }else{
            axios
                .get(`/api/search/${searchType}/${keyword}`)
                .then(res => {
                    console.log(res.data);
                    this.setState({resultList:res.data});
                    // for (let index = 0; index < res.data.length; index++) {
                    //     const element = res.data[index];
                    //     console.log(element);
                    //     // return (<div>element._source.title</div>)
                    // }
                })
                .catch(err => {
                    this.setState({ errors: err.response.data });
                    console.log(err.response.data);
                });
            }
    }
    render() {
        return (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              onKeyDown={this.onKeyPressed}
              aria-label="Text input with dropdown button"
              value={this.state.inputValue}
              onChange={evt => this.updateInputValue(evt)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary "
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                Search{" "}
              </button>
                    {this.state.resultList.length > 0 && 
              <div className="dropdown-menu show">
                     
                { this.state.resultList.map(result => {
                    {return <a className="dropdown-item show" href="#" key={result._id}>
                        {result._source.title}
                        
                    </a>}
                })}
                       
                
              </div>
            }
            </div>
          </div>
        );
    }
    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        },this.handleChange(evt.target.value));
        
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
                    for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index];
                        console.log(element._source.title);
                        return (<div>element._source.title</div>)
                    }
                })
                .catch(err => {
                    this.setState({ errors: err.response.data });
                    console.log(err.response.data);
                });
        }
    };


}

