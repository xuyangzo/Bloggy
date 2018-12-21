import React from 'react';
import Header from './Header';
import Body from './Body';
import Form from './Form.test';

export default class Bloggy extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header />
                <Body />
                <Form />
            </div>
        );
    }
}