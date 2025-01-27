import React from "react";
import { Link } from "react-router-dom";

const Tab1 = () => {
  return (
    <div>
      Tab1
      <div>
        <Link to="/tab1/tab2">to tab2</Link>
      </div>
    </div>
  );
};

export default Tab1;
