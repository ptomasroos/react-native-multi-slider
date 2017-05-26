# react-native-multi-slider

Pure JS react native slider component with one or two markers.
Options to customize track, touch area and provide customer markers and callbacks for touch events and value changes.

Features:

Written fully in ES6

Supports Immutable Data

Easy to plug into Redux-Form for use as a Form Field

Supports Material Community Icons as markers 


Submission Guidelines:

PR's always welcome, please lint all submissions using the airbnb's eslint standards
![Example](https://raw.githubusercontent.com/ptomasroos/react-native-multi-slider/master/docs/demo.gif)


## Getting Started

- [Installation](#installation)

### Installation

```bash
$ npm install --save @ptomasroos/react-native-multi-slider
$ react-native link
```

### PropTypes And Usage
````
  values: PropTypes.arrayOf(PropTypes.number):
    default: [0],
        The value of the marker on the track.
        Also used to create a second marker,
        simply pass a values array with two values,
        i.e. [0,1]. 
        Just make sure the second value is greater
        than the first. 
        If immutable is enabled the values array can be immutable
  
  onValuesChangeStart: PropTypes.func
    default: undefined
        This provides the ability for a callback function
        when the slider is moved. Does not return any values.
    
  onValuesChange: PropTypes.func
    default: undefined
        A callback function that is called when the slider is moving.
        Returns Values array with current position,
        If immutable is enabled returns an Immutable List
  
  onValuesChangeFinish: PropTypes.func
    default: undefined
        A callback function that is called when the slider is finished moving.
        Returns Values array with positon after slider is finished moving.
        If immutable is enabled returns an Immutable List.
        This is the recommended way to get access to slider values.
  
  sliderLength: PropTypes.number
  default: 280,
        The pixel value of the length of the slider component
  
  touchDimensions: PropTypes.object
  default: {
    borderRadius: 15,
    slipDisplacement: 200,
   }
   
        Specifies the border radius of the slider bar, as well as the 
        vertical touch slop for a touch to still be interpreted as a valid slider event
  
  customMarker: PropTypes.element
  default: DefaultMarker
        Allows for use of custom markers, must be renderable element.
  
  min: PropTypes.number
  default: 0
        The minimum value for the sliders range.
  
  max: PropTypes.number
  default: 10
        The maximum value for the sliders range.
  
  step: PropTypes.number
  default: 1
        The amount the slider increments by.
  
  containerStyle: ViewPropTypes.style
        Allows custom styling of the container which holds the slider component.
  
  trackStyle: ViewPropTypes.style
        Allows custom styling of the appearance of the slider track.
  
  markerStyle: ViewPropTypes.style
        Allows custom styling of the appearance of the default marker.
  
  enabledOne: PropTypes.bool
  default: True,
        Allows for disabling the first marker.
  
  enabledTwo: PropTypes.bool
  default: True,
        Allows for disabling the second marker.
  
  onToggleOne: PropTypes.func
  default: Undefined
        A callback function which is called when the first marker is pressed. 
        As an example, Could be used as a toggle function for disabling the first marker
  
  onToggleTwo: PropTypes.func
  default: Undefined
        A callback function which is called when the second marker is pressed. 
        As an example, Could be used as a toggle function for disabling the second marker
  
  snapToValue: PropTypes.bool
  default: True,
        Determines weather or not the marker on the slider should only allow anything but a
        whole value for its position. This results in a 'Snap' like effect if the value
        when the marker has finished moving is not a whole value.
  
  icon: PropTypes.bool
  default: false
        Determines if the marker on the slider shows an icon. 
        Supports Material Community Icons from the react-native-vector-icons package.
  
  iconOneName: PropTypes.string
  default: 'check'
        The name of the icon to be used by the first marker on the slider.
        Currently only support Material Community Icon names.
        icon prop must be enabled to use.
  
  iconTwoName: PropTypes.string
  default: 'check'
          The name of the icon to be used by the second marker on the slider.
          Currently only support Material Community Icon names.
          icon prop must be enabled to use.
  
  iconOneDisabledName: PropTypes.string
    default: 'alarm-off'
            Allows for chosing a seperate icon to display if the first
            marker is disabled
  
  iconTwoDisabledName: PropTypes.string
  default: 'alarm-off'
              Allows for chosing a seperate icon to display if the first
              marker is disabled
    
  
  iconOneColor: PropTypes.string
   default: 'green'
        Background color of icon for first marker.
   
  iconTwoColor: PropTypes.string
  default: 'green',
        Background color of icon for second marker.
  
  iconOneDisabledColor: PropTypes.string
  default: 'grey',
        Background color of icon for first marker if disabled.
  
  iconTwoDisabledColor: PropTypes.string
      default: 'grey',
            Background color of icon for second marker if disabled.
  
  immutable: PropTypes.bool
    default: false,
        Toggles support for immutable data, if enabled all values returned through
        callback functions are immutable. Also allows passing of immutable Values array
