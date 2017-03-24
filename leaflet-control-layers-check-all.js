'use strict';


// .gamda-control-layers .leaflet-control-layers-toggle{
//     background-image: none;
//     color: #5F7C8A;
// }

L.control.layers.checkAll = function(options) {
    return new L.Control.Layers.CheckAll(options);
}


L.Control.Layers.CheckAll = L.Control.Layers.extend({

    options: {
        position: 'topright',
        icon: 'podcast',
        color: '#000000',
        allText: 'All',
    },

    initialize: function (baseLayers, overlays, options) {
        L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);
        container.classList.add('gamda-control-layers');
        container.childNodes[0].style.color = this.options.color;
        container.childNodes[0].innerHTML = '<center>' +
                                            '<span style="margin-top:4px;" class="fa fa-2x fa-' +
                                            this.options.icon + '"></span>' +
                                            '<span class="fa fa-caret-down"></span>';
                                            '</center>';
        return container;
    },

    showAll: function () {
        var inputs = this._form.getElementsByTagName('input');
        var input, layer;
        for (var i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            if (input.layerId == -1)
                continue
            layer = this._getLayer(input.layerId).layer;
            this._map.addLayer(layer);
        }
    },

    hideAll: function () {
        var inputs = this._form.getElementsByTagName('input');
        var input, layer;
        for (var i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            if (input.layerId == -1)
                continue
            layer = this._getLayer(input.layerId).layer;
            this._map.removeLayer(layer);
        }
    },

    _allClick: function (ev) {
        ev.stopPropagation();
        var show = ev.target.checked;
        show ? this.showAll() : this.hideAll();
        var that = this;
        // stopPropagation() causes the check to never change state
        // If the state is changed manually, it wil be reverted by the browser after the function
        // finishes execution. By setting a timeout, we execute the code after the browser has
        // reverted the state and the check will change normally.
        // http://stackoverflow.com/a/22016879/1332561
        setTimeout(function () {
            that.allInput.checked = show;
        }, 1);
    },

    _update: function () {
        L.Control.Layers.prototype._update.call(this);
        this._addItem({layer: null, name: this.options.allText, overlay: true, fake: true});
    },

    _addItem: function (obj) {
        if (!obj.fake)
            return L.Control.Layers.prototype._addItem.call(this, obj);

        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'leaflet-control-layers-selector';
        input.checked = false;
        input.layerId = -1;

        L.DomEvent.on(input, 'click', this._allClick, this);
        this.allInput = input;

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        var holder = document.createElement('div');

        label.appendChild(holder);
        holder.appendChild(input);
        holder.appendChild(name);

        var container = this._overlaysList;
        container.insertBefore(label, container.firstChild);

        return label;
    },

    _getLayer: function (layerId) {
        if (layerId > -1)
            return L.Control.Layers.prototype._getLayer.call(this, layerId);
        return {layer: {options: {}}};
    },

    _onInputClick: function () {
        // Same behavior, only override to skip 'all' input and remove check when removing others
        var inputs = this._form.getElementsByTagName('input'),
            input, layer, hasLayer;
        var addedLayers = [],
            removedLayers = [];

        this._handlingClick = true;

        for (var i = inputs.length - 1; i >= 0; i--) {
            input = inputs[i];
            if (input.layerId == -1)
                continue
            layer = this._getLayer(input.layerId).layer;
            hasLayer = this._map.hasLayer(layer);

            if (input.checked && !hasLayer) {
                addedLayers.push(layer);

            } else if (!input.checked && hasLayer) {
                removedLayers.push(layer);
            }
        }

        for (i = 0; i < removedLayers.length; i++) {
            this._map.removeLayer(removedLayers[i]);
        }
        for (i = 0; i < addedLayers.length; i++) {
            this._map.addLayer(addedLayers[i]);
        }

        if (removedLayers.length > 0) {
            this.allInput.checked = false;
        }

        this._handlingClick = false;

        this._refocusOnMap();
    },
});