import React from 'react';

const Header = () => {
    return (
        <header className="masthead" style={{backgroundImage: "url('../../../html/img/about-bg.jpg')"}}>
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <div className="page-heading">
                            <h1>About Me</h1>
                            <span className="subheading">This is what I do.</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;