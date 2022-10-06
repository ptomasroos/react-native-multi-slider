import React from 'react';
import {View, StyleSheet} from 'react-native';

interface ICustomCutsProps{
    customCuts?:number[];
      /**
     * can be used to render custom marker over slider (Will not block Marker movement)
     */
    renderCustomCuts?:React.ComponentType<any>;
    min?:number;
    max?:number;
}
const CustomCutsComponent:React.FunctionComponent<ICustomCutsProps>=(props)=>{
    if(!!props?.customCuts?.length && isValidCuts(props?.customCuts, props?.min, props?.max)){
        if(props?.renderCustomCuts){
            const Component = props?.renderCustomCuts;
            return <Component customCuts={props?.customCuts} min={props.min} max={props.max}/>
        }else{
            return(
                <View style={styles.cutsContainer} pointerEvents={'none'}>
                    {props?.customCuts?.map?.(value => (
                        <View
                        pointerEvents={'none'}
                        style={[
                            styles.cut,
                            { left: `${((value - props.min) * 100) / (props?.max - props?.min)}%` },
                        ]}
                        />
                    ))}
              </View>
            )
        }
    }
    return null;
}
CustomCutsComponent.defaultProps={
    customCuts:[],
    renderCustomCuts:undefined,
    min: 0,
    max: 10,
}

const isValidCuts =(customCuts:number[], min:number, max:number)=>{
    const len:number = customCuts?.length ?? 0;
    if(!!len && customCuts?.[0] >= min && customCuts?.[len-1] <= max){
        let result = true;
        let prev = customCuts?.[0];
        for(let i=1; i< len; i++){
            if(customCuts[i] < prev){
                result = false;
                break;
            }
        }
        return result;
    }
    return false;
}

const styles = StyleSheet.create({
    cutsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 8,
        top: -1,
      },
      cut: {
        position: 'absolute',
        width: 8,
        borderRadius: 4,
        backgroundColor: '#FFF',
        height: 8,
      },
})

export default CustomCutsComponent;