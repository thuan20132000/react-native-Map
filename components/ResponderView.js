

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';



const ResponderView = (props) => {

    const [getAnimation,setAnimation] = useState(
        {
            x:null,
            y:null,
            rotate:new Animated.Value(0)
        }
    );



    const handlerOnPress = (event) =>{
        const {locationX,locationY} = event.nativeEvent;
    };
    const handlerOnMove = (event) =>{
        const {locationX,locationY} = event.nativeEvent;
    }

   

    const handlerOnRelease = (event) =>{
        console.log('releasing.......');
    }

    

        Animated.loop(
            Animated.sequence([
                Animated.timing(getAnimation.rotate,
                    {
                        toValue:1,
                        duration:3000
                    }
                ),
                Animated.timing(getAnimation.rotate,
                    {
                        toValue:0,
                        duration:3000
                    }
                )
            ])
            
        ).start();
    

    const animationRotate =  getAnimation.rotate.interpolate({
        inputRange:[0,1],
        outputRange:['-25deg','25deg'],
    });
    const animateSkew = getAnimation.rotate.interpolate({
        inputRange:[0,1],
        outputRange:['45deg','-45deg']
    });
    const animateOpacity = getAnimation.rotate.interpolate({
        inputRange:[0,1],
        outputRange:[1,0]
    });

    return (
        <View style={styles.container}
            onStartShouldSetResponder={()=>true}
            onMoveShouldSetResponder={()=>true}
            onResponderGrant={handlerOnPress}
            onResponderMove={handlerOnMove}
            onResponderRelease={handlerOnRelease}

        >

            <Animated.Image style={styles.image,{borderRadius:50,transform:([{rotate:animationRotate},{skewX:animateSkew}]),opacity:animateOpacity}}
                source={require('../assets/1.jpg')}
            />

        </View>
    )

}
export default ResponderView;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'coral',
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:200,
        height:260,
        // transform:{[rotate:'sa']}
    }
})