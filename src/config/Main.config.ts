import Friends from "../tabs/main/Friends/Friends";
import Home from "../tabs/main/Home/Home";
import Notification from "../tabs/main/Notification";
import Profile from "../tabs/main/Profile/Profile";
import config from "./../../Images.config"

const MainTab = [
    {
      name: "Home",
      component: Home,
      image: config['logo-wordless-grey'],
      imageSelected: config['logo-wordless-white'],
    },
    {
      name: "Friends",
      component: Friends,
      image: config['friends-grey'],
      imageSelected: config['friends-white'],
    }, 
    {
      name: "Profile",
      component: Profile,
      image: config['profile-grey'],
      imageSelected: config['profile-white'],
    },
  ];
  export default MainTab;