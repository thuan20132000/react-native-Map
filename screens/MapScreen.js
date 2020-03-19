
import React, { createRef, useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, Dimensions, Easing, Button } from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import { markersPosition } from '../data/markers';


const MapSceen = () => {
    const _mapRef = useRef();
    const _ScrollRef = React.createRef();

    const CARD_WIDTH = Dimensions.get('window').width;
    const CARD_HEIGHT = Dimensions.get('window').height;

    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    }




    const [AnimationEffect] = useState(new Animated.Value(0));
    const [getIndex, setIndex] = useState(0);
    const [selectedLocation,setSelectedLocation] = useState({location:'',checked:true});



    useEffect(() => {

            AnimationEffect.addListener(({ value }) => {
                let index = Math.floor(value / CARD_WIDTH + 0.3);
                if (index >= markersPosition.markers.length) {
                    index = markersPosition.markers.length - 1;
                }
                if (index <= 0) {
                    index = 0;
                }
                
                clearTimeout(regionTimeout);
                const regionTimeout = setTimeout(() => {
                    if (getIndex == !index) {
                        
                        setIndex(index);
                        const { coordinate } = markersPosition.markers[index];
                        const position = {
                            ...coordinate,
                            latitudeDelta: 0.004,
                            longitudeDelta: 0.004
                        }
                        _mapRef.current.animateToRegion(position, 1000);
    
                    }
                                      
                }, 10);
    
    
            });


    }, []);


    const interpolations = markersPosition.markers.map((mark, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH
        ]

        const scale = AnimationEffect.interpolate({
            inputRange,
            outputRange: [1, 2.5, 1],
            extrapolate: 'clamp'
        })
        const opacity = AnimationEffect.interpolate({
            inputRange,
            outputRange: [.35, 1, .35],
            extrapolate: 'clamp'
        })

        return { scale, opacity }

    });


    const [getDetailClick, setDetailClick] = useState({ height: 200, sawDetail: false });
    const [AnimationDetailClick] = useState(new Animated.Value(200));
    const handlerPressImages = (mark, event) => {
        const regionMoveTo = {
            ...mark.coordinate,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004

        }
        _mapRef.current.animateToRegion(regionMoveTo, 2000);
        

        

        if (!getDetailClick.sawDetail) {// not yet detailed
            // setDetailClick({height:400,sawDetail:!getDetailClick.sawDetail});
            Animated.timing(AnimationDetailClick,
                {
                    toValue: CARD_HEIGHT -10,
                    duration: 800,
                    easing: Easing.back()
                }
            ).start();
            setDetailClick({ sawDetail: true });

        } else {
            // setDetailClick({height:200,sawDetail:!getDetailClick.sawDetail});
            Animated.spring(AnimationDetailClick,
                {
                    toValue: 200,
                    duration: 2200
                }
            ).start();
            setDetailClick({ sawDetail: false });
        }

        console.log(mark.id);

    }

    const detailLocation = (mark) => {
        return (
            <Animated.View style={[styles.detailContainer,{height:'100%'}]}>
                <Text style={styles.textTitle}>{mark.title}</Text>
                <Text style={styles.textDescription}>{mark.description}</Text>
                
                        <TouchableOpacity style={{backgroundColor:'#ff5050',borderRadius:50,height:50,justifyContent:'center'}}
                            onPress={()=>{
                                console.log(mark);
                            }}
                        >
                            <Text style={{textAlign:'center',fontSize:24,color:'white'}}>Detail</Text>
                        </TouchableOpacity>
            </Animated.View>
        )
    }

    

    return (
        <View style={styles.mapScreen}>
            <MapView style={styles.mapScreen}
                initialRegion={initialRegion}
                ref={_mapRef}
            >
                {markersPosition.markers.map((mark, index) => {
                    const scaleStyle = {
                        transform: [
                            {
                                scale: interpolations[index].scale
                            }
                        ]
                    }
                    const opacityStyle = {

                        opacity: interpolations[index].opacity


                    }

                    return (
                        <MapView.Marker key={index} coordinate={mark.coordinate}>
                            <Animated.View style={[styles.markerWrap, opacityStyle]}>
                                <Animated.View style={[styles.ring, scaleStyle]} />
                                <View style={styles.marker} />
                            </Animated.View>
                        </MapView.Marker>
                    )
                })

                }
            </MapView>
            <Animated.ScrollView style={styles.scrollView}
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={true}
                snapToInterval={420}
                style={styles.scrollView}
                contentContainerStyle={styles.endPadding}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: AnimationEffect,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true }
                )}

            >


                {markersPosition.markers.map((mark, index) => {
                    return (
                        <TouchableOpacity key={index} style={[styles.touchStyle]}
                            onPress={()=>{
                                handlerPressImages(mark)
                            }}
                            ref={_ScrollRef}

                        >
                            <Animated.View style={[{ height: AnimationDetailClick,width:400},styles.cardContainer]}>
                                <Animated.View style={[styles.card]}>
                                    <Animated.Image
                                        source={{ uri: mark.image }}
                                        style={styles.cardImage}
                                    />
                                    <Animated.View style={styles.textContent}>
                                        <Text numberOfLines={1} style={styles.cardtitle}>{mark.title}</Text>
                                        <Text numberOfLines={1} style={styles.cardDescription}>
                                            {mark.description}
                                        </Text>
                                    </Animated.View>
                                </Animated.View>

                                {
                                    getDetailClick.sawDetail && (
                                        detailLocation(mark)
                                    )
                                }
                            </Animated.View>
                        </TouchableOpacity>
                    )
                })}


            </Animated.ScrollView>
        </View>

    )
}
export default MapSceen;

const styles = StyleSheet.create({
    mapScreen: {
        flex: 1
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 4,
    },
    cardContainer:{
        backgroundColor:'rgba(255, 153, 50,0.7)',
        paddingVertical:0,
        borderRadius:50,
    },
    touchStyle:{
        marginHorizontal:10
        
    },
    card: {
        backgroundColor: "#FFF",
        // marginHorizontal: 14,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        height: 200,
        width: 400,
        overflow: "hidden",
        borderRadius:24
    },
    cardImage: {
        width: '100%',
        height: '100%'
    },
    // endPadding: {
    //     paddingRight: 0,
    // },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 33, 33,0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255, 33, 33,0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "red",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
        textAlign: 'center'
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    textTitle:{
        fontWeight:'bold',
        textAlign:'center',
        color:'#ff6666',
        fontSize:26
    },
    textDescription:{
        fontSize:18,
        textAlign:'justify',
        color:'white',
        lineHeight:30,
        marginBottom:100
        
    },
    detailContainer:{
        padding:16
    }
});