/**
 * Author: Lynch
 * Last Modified: 2019.06.09
 */
import React from "react";
import axios from "axios";
import classnames from "classnames";

export default class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favoritesList: [],
      selected: "asd6123hjasdv#^@#",
      user: "",
      listContent: []
    };
  }

  componentDidMount = () => {
    const mock = [
      {
        name: "Default",
        id: "asd6123hjasdv#^@#"
      },
      {
        name: "JavaScript",
        id: "%!@%656316"
      },
      {
        name: "Naked Movies",
        id: "asd78123nasnd"
      }
    ];

    // check if in dashboard or profile
    // axios.get("/api/favorites/list");

    this.setState(prevState => ({ ...prevState, favoritesList: mock }));
  };

  render() {
    return (
      <div className="favorites">
        <div className="left-bar">
          <div className="favorite-list-new">
            <i className="fa fas fa-plus-circle" />
            &nbsp;&nbsp;&nbsp;添加收藏夹
          </div>
          <hr />
          {this.state.favoritesList.map((favorite, index) => (
            <div
              className={classnames("favorite-list-item", {
                selected: this.state.selected === favorite.id
              })}
              key={index}
            >
              {favorite.name}
            </div>
          ))}
        </div>
        <div className="right-bar">
          <div className="favorites-op-bar">b</div>
          <div className="favorites-content">c</div>
          <div className="favorites-pagination">d</div>
        </div>
      </div>
    );
  }
}
