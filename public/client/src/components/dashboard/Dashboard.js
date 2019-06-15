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
            <div class="container my-5" style={{ paddingTop: "65px" }}>
                <div class="row justify-content-md-center">

                    <div class="col-sm-10 col-md-12 mx-auto">
                       
                        Dashboard Page
                    </div>
                </div>
            </div>
        );
    }
}
