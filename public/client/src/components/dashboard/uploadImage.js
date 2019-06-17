import React from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';

//import './styles/styles.scss';
//import './../styles/styles.scss'
const Spinner = () => (
    <div>
        <div className="loader"></div>
    </div>

);
/*
const Button = (props) => (
    <div>
        <label htmlFor='multi'>
            <input id="file" type="file" name="file" accept="image/*" onChange={props.onChange} className="inputfile" />
            {

            }
        </label>
    </div>
);
*/

/*
    <input type="file" name="file" id="file" class="inputfile" />
    <label for="file">Choose a file</label>
*/
class ProfilePhoto extends React.Component {
    constructor(props) {
        super(props);
        const decoded = jwt_decode(this.props.token);
        this.state = {
            token: props.token,
            error: undefined,
            PhotoUrl: '',
            fileInfo: undefined
        };
    }



    ComponentDidMount()
    {

    }
    onSubmit = () => {
        console.log("submitting...");
        let user = this.state.decoded;

        let data = {
            user,
            files: {
                avatar: this.state.fileInfo
            }
        };

        ///api/users/register
        axios.post("/api/users/upload/avatar",data)
        .then(res => {
            console.log(res);
        })

    }
    onChange = e => {
        const file = e.target.files[0]
        console.log(file);
        this.setState(() => ({
            fileInfo: file
        }));





    }

    render() {
        return (
            <div>
                <h3>Want to change or upload your photo?</h3>
                
                    <input id="file" type="file" name="file" accept="image/*" onChange={this.onChange} className="inputfile" />
                    <button type="submit" value="Submit" onClick={this.onSubmit}>submit!</button>
                
                
            </div>
        );
    }
}

export default ProfilePhoto;