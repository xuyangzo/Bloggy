import React from 'react';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <form method='post' action='/data'>
                    name: <input type='text' name="name" />
                    age: <input type='text' name="age" />
                    <input type='submit' value='submit'/>
                </form>
            </div>
        );
    }
}