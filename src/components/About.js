import User from "./User";
import UserClass from "./UserClass";
import { Component } from "react";
import UserContext from "../utils/UserContext";

class About extends Component {
  constructor(props) {
    super(props);

    //console.log("Parent Constructor");
  }

  componentDidMount() {
    //console.log("Parent Component Did Mount");
  }

  render() {
    //console.log("Parent Render");

    return (
      <div>
        <h1 className="font-bold pl-4">About</h1>
        <div>Logged In User:
          <UserContext.Consumer>
            {({ loggedInUser }) => (
              <h2 className="text-xl font-bold">{loggedInUser}</h2>
            )}
          </UserContext.Consumer>
        </div>
        <h3>This is Namaste React Web Series</h3>
        <UserClass name={"First"} location={"Second"} />
      </div>
    );
  }
}

export default About;
