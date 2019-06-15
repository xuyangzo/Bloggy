import React from "react";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("jwtToken");
        this.state = {
            token
        };
    }



    render() {
        return (
            <div className="container my-5" style={{ paddingTop: "65px" }}>
                <div className="row justify-content-md-center">

                    <div className="col-sm-10 col-md-12 mx-auto">
                       
                        Dashboard Page
                    </div>
                </div>
            </div>
        );
    }
}
