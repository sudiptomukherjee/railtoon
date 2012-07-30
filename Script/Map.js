//--------------------------------------------------------------------------------
//  Map.js is part of the BART dashboard widget.        (c) 2005 Bret Victor
//  This software is licensed under the terms of the open source MIT license.
//--------------------------------------------------------------------------------
//
//  The Map class is a thin encapsulation of a map's images and station
//  coordinates, which MapView and MapbarView use to do their thing.
//

function Map (name) {

    //---------------------------------------------------------------
    //  Public properties
    
    this.image      = getImage("Maps/" + name + "/map.jpg")
    this.icon_image = getImage("Maps/" + name + "/icon.png")
    this.name_image = getImage("Maps/" + name + "/name.png")

    this.name     = name
    this.stations = {}

    //---------------------------------------------------------------
    //  For use in info.js

    this.addStation = function (name,lon,lat) {
        this.stations[name] = { lon:lon, lat:lat }
    }

    //---------------------------------------------------------------
    //  Add to list when created.

    Map.maps.push(this) 
}


//---------------------------------------------------------------
//  Global map list.

Map.maps = []
//Map.xapi_uri = 'http://open.mapquestapi.com/xapi/api/0.6/'
Map.cloudmade_key = 'c8cca92e274c4e1e9eb70525a5290e91'

Map.forEachMap = function (f) {
    for (var i=0; i < Map.maps.length; i++) {
        f(Map.maps[i])
    }
}

Map.getMapByName = function (name) {
    for (var i=0; i < Map.maps.length; i++) {
        var map = Map.maps[i]
        if (map.name == name) { return map }
    }
}

Map.getMapByIndex = function (index) {
    return Map.maps[index]
}

Map.load = function () {
    var po = org.polymaps;
    var color = d3.scale.linear()
        .domain([0, 50, 70, 100])
        .range(["#F00", "#930", "#FC0", "#3B0"]);

    var map = po.map()
        .container($("#bart_map_svg")[0]) //.append(po.svg("svg"))[0])
        .add(po.interact())
        .add(po.hash())
    map.add(po.image()
        .url(po.url("http://{S}tile.cloudmade.com"
        + "/" + Map.cloudmade_key // http://cloudmade.com/register
        + "/998/256/{Z}/{X}/{Y}.png")
        .hosts(["a.", "b.", "c.", ""])));
    map.add(po.compass()
        .pan("none"));
    map.add(po.geoJson()
        .url("Data/streets.json")
        .id("streets")
        .tile(false)
      .on("load", po.stylist()
        .attr("stroke", function(d) { return color(d.properties.PCI); })
        .title(function(d) { return d.properties.STREET + ": " + d.properties.PCI + " PCI"; })));
    map.zoom(12);
}
