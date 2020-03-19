
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Button, Easing } from 'react-native';




const FadeInView = (props) => {
    const [fadeAnimation] = useState(new Animated.Value(200));
    const [heightAnimation] = useState(new Animated.Value(100));
    const [borderRadiusAnimation] = useState(new Animated.Value(0));

    const [getWidth, setWidth] = useState(400);
    const [getHeight, setHeight] = useState(300);
    

    const position = useState(new Animated.ValueXY({x:15,y:15}))

    const handlerClick = () => {
        let width = getWidth + 100;
        let height = getHeight + 50;

       
        Animated.sequence([
            
            Animated.decay(position, {   // coast to a stop
                velocity: {x: gestureState.vx, y: gestureState.vy}, // velocity from gesture release
                deceleration: 0.997,
            })


        ]).start(); // start the sequence group

        

    }

    // useEffect(() => {
    //     // handlerClick();
    // }, []);

    return (
        <Animated.View // Special animatable View
            style={{
                ...props.style,
                width: fadeAnimation, // Bind opacity to animated value
                height: heightAnimation,
                borderRadius: borderRadiusAnimation
            }}>
            {props.children}
            <Button
                title="Click Here"
                onPress={handlerClick}
            />
        </Animated.View>
    );

}


export default FadeInView;