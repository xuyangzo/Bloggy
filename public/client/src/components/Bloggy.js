import React from 'react';
import Header from './Header';
import Body from './Body';

export default class Bloggy extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Header />
                <Body />
            </div>
        );
    }
}