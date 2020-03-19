

import React from 'react';
import {StyleSheet,View,Text, Button} from 'react-native';

const AuthScreen = (props) =>{

    console.log(props);
    return(
        <View style={styles.screenContainer}>
            <Text>Authentication Screen</Text>
            <View>
                <Button
                    title="Go to Map Screen"
                    onPress={()=>{
                            props.navigation.navigate('map');
                    }}
                />
            </View>
        </View>
    )
}

export default AuthScreen;
const styles = StyleSheet.create({
    screenContainer:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        alignItems:"center"

    },
});