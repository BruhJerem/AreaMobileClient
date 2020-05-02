import SignUp from '../screens/SignUp'
import Login from '../screens/Login'
import LoginSettings from '../screens/LoginSettings'
import {createStackNavigator} from "react-navigation";


export default createStackNavigator({
    Login: Login,
    SignUp: SignUp,
    LoginSettings: LoginSettings
}, {
    navigationOptions : {
        /*header: null,*/
    },
});
