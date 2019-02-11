import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default class SearchBar extends React.Component {
                 constructor(props) {
                   super(props);
                   this.state = {
                     inputValue: "",
                     resultList: [],
                     event : false
                   };
                    
                 }

                componentWillMount(){

                    document.addEventListener('click',this.handleClick,false);
                }
                componentWillUnmount() {
                    document.removeEventListener('click', this.handleClick, false);
                }
                componentWillReceiveProps(nextProps){
                    if(nextProps.initial === true){
                        this.setState({ resultList: [] });
                    }
                }
                handleClick = e => {
                  // console.log(e);
                    if(this.node.contains(e.target)){
                        return;
                    }
                    this.setState({resultList:[]});
                }

                 handleChange = e => {
                   // e.preventDefault();
                   const searchType = "all";
                   const keyword = e;
                   if (e.trim() == "" || e == undefined) {
                     this.setState({ resultList: [] });
                   } else {
                     axios
                       .get(
                         `/api/search/${searchType}/${keyword}`
                       )
                       .then(res => {
                         // console.log(res.data);
                         this.setState({ resultList: res.data });
                       })
                       .catch(err => {
                         this.setState({
                           errors: err.response.data
                         });
                         console.log(err.response.data);
                       });
                   }
                 };

                 render() {
                   return (
                       <div className="input-group" ref={node => this.node = node}>
                       <input
                         type="text"
                         className="form-control input_length"
                         onKeyDown={this.onKeyPressed}
                         aria-label="Text input with dropdown button"
                         value={this.state.inputValue}
                         onChange={evt =>
                           this.updateInputValue(evt)
                         }
                         //onBlur={this.handleBlur}
                         id = "input"
                        //  onFocus={this.handleOnFocus}
                         
                       />
                       <div className="input-group-append">
                         <button
                           className="btn btn-outline-secondary "
                            type="button"
                          //  data-toggle="dropdown"
                          //  aria-haspopup="true"
                          //  aria-expanded="true"
                          onClick={this.handleOnClick}
                         >
                           Search{" "}
                         </button>
                         {this.state.resultList.length > 0 && (
                           <div className="dropdown-menu show" id="menu">
                             {this.state.resultList.map(
                               result => {
                                 {
                                   return (
                                     <Link
                                       className="dropdown-item show"
                                       to={"/view/" + result._id}
                                       key={result._id}
                                       onClick={this.onHandleClose}
                                     >
                                       {<p>{result._source.title} -----by {result._source.author}</p>}
                                     </Link>
                                   );
                                 }
                               }
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 }
                 updateInputValue(evt) {
                   this.setState(
                     {
                       inputValue: evt.target.value
                     },
                     this.handleChange(evt.target.value)
                   );
                 }
                 handleOnClick = e => {
                  //  console.log(456);
                   this.props.onGotoSearch(this.state.inputValue);
                 };

                 onKeyPressed = e => {
                   if (e.keyCode === 13) {
                     
                    this.props.onGotoSearch(this.state.inputValue);
                   }
                 };
                onHandleClose = e => {
                  this.setState(() => ({
                    resultList: []
                  }));
                };
               }


