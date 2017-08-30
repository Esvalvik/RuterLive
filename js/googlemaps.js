// Ikoner
var ikonBase  = "img/ikoner/";
var ikoner = {
          buss: ikonBase + 'ikon_buss.png',
          trikk: ikonBase + 'ikon_buss.png',
          tbane: ikonBase + 'ikon_buss.png',
          tog: ikonBase + 'ikon_buss.png'
        };

// Map
var osloCoords = {lat: 59.9138688, lng: 10.7522454};
var map;
var bussMarkers = new Array();

setInterval(updateMap, 100); 
setInterval(updateSanntid, 10000); 

function initMap()
{
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: osloCoords
        });
}

function updateMap()
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            var transport = ROUTE_MANAGER[i].getTransport();
            for(var j = 0; j < transport.length; j++)
            { 
                transport[j].setPosition(ROUTE_MANAGER[i].getPositionFromStop(transport[j].getHeadingTo()));
            }
        }
    } 
}

function updateSanntid()
{
   if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            var stops = ROUTE_MANAGER[i].getStops();
            for(var j = 0; j < stops.length; j++)
            {
                getSanntid(stops[j].getId(), ROUTE_MANAGER[i].getId());
            }
        }
    } 
}