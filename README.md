# leaflet-control-layers-check-all

L.Control.Layers.checkAll | L.control.layers.CheckAll

Like L.Control.Layers, but it adds a checkbox at the top
which turns all layers on/off. 

Options:
* **position**: Leaflet position string. Default: `topright`
* **icon**: string indicating which [FontAwesome](http://fontawesome.io/)
    icon to use. Default: `podcast`
* **color**: string representing hex color. Default: `#000000`
* **allText**: string to show on checkbox. Default: `All`

Methods:
* **showAll()**: add all layers in the control to map
* **hideAll()**: remove all layers in the control from map

If you don't want the background image added by leaflet, add this CSS:

.gamda-control-layers .leaflet-control-layers-toggle {  
    background-image: none;  
    color: #000000; /* is overriden by color in options */  
}
