// HTML UI COMS

function btnAddTransport()
{
    var inputValue = document.getElementById("inputTransportId").value;
    if(inputValue != null || inputValue === "" )
    {
        getLinjeData(inputValue);
        print("Henter stoppdata for rute " + inputValue);
        //document.getElementById("btnAddTransport").disabled = true;
    }
}

function btnRemoveTransport()
{
    var selectRoute = document.getElementById("selectRoute");
    if(selectRoute != null)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(selectRoute.value == i)
            {
                var tran = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < tran.length; j++)
                {
                    tran[j].getMarker().setMap(null);
                }
                ROUTE_MANAGER[i] = null;
                print("Slettet rute: " + selectRoute.value);
            }
        }
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                selectedMarkerRoute = i;
                selectedMarkerTransport = 0;
            }
        }
        updateDropdown();
    }
}

function updateInfo()
{
    if(selectedMarkerRoute != null && selectedMarkerTransport != null)
    {
        var route = ROUTE_MANAGER[selectedMarkerRoute];
        if(route != null)
            var tran = route.getTransport()[selectedMarkerTransport];
        else return;
        if(tran != null)
        {
            document.getElementById("infoTitle").innerHTML = "Tittel: " + tran.getTitle();
            document.getElementById("infoId").innerHTML = "Id: " + tran.getId();
            document.getElementById("infoPosition").innerHTML = "Posisjon: " + tran.getPosition().lat + ",\n " + tran.getPosition().lng;
            document.getElementById("infoSpeed").innerHTML = "Hastighet: " + tran.getVelocity();
            document.getElementById("infoTowardsPosition").innerHTML = "Towards-Posisjon: " + tran.getTowardsPosition().lat + ",\n " + tran.getTowardsPosition().lng;
            document.getElementById("infoLastPosition").innerHTML = "Last-Posisjon: " + tran.getLastPosition().lat + ",\n " + tran.getLastPosition().lng;
            document.getElementById("infoOriginId").innerHTML = "StartId: " + tran.getOriginId();
            document.getElementById("infoOriginName").innerHTML = "StartNavn: " + tran.getOriginName();
            document.getElementById("infoDestinationId").innerHTML = "DestinasjonsId: " + tran.getDestinationId();
            document.getElementById("infoDestinationName").innerHTML = "DestinasjonsNavn: " + tran.getDestinationName();
            document.getElementById("infoHeadingTo").innerHTML = "NesteStopp: " + getStopNameFromId(selectedMarkerRoute, tran.getHeadingTo());
            document.getElementById("infoHeadingFrom").innerHTML = "SistStopp: " + getStopNameFromId(selectedMarkerRoute, tran.getHeadingFrom());
            
            var changeSecond = Math.abs((new Date() - tran.getArrivalTime())/1000);
            document.getElementById("infoTimeLeft").innerHTML = "Tid igjen: " + changeSecond + " sekunder";
        }
    }
}

function print(text)
{
    console.log(text);
    document.getElementById("infoConsole").innerHTML = text;
}

function updateDropdown()
{
    var selectRoute = document.getElementById("selectRoute");
    var selectTransport = document.getElementById("selectTransport");
    
    if(ROUTE_MANAGER.length != selectRoute.length)
    {
        $('#selectRoute').empty()

        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                var valg = document.createElement("option");
                valg.text = ROUTE_MANAGER[i].getId();
                valg.value = i;
                selectRoute.add(valg);   
            }
        }
    }
    
    onChangeRoute();
}

function onChangeRoute()
{
    if(ROUTE_MANAGER.length > 0)
    {
        if(ROUTE_MANAGER[selectRoute.options[selectRoute.selectedIndex].value] != null)
        {
           var transportArr = ROUTE_MANAGER[selectRoute.options[selectRoute.selectedIndex].value].getTransport();
        
            if(transportArr != null && transportArr.length > 0)
            {
                if(transportArr.length != selectTransport.length)
                {
                    $('#selectTransport').empty()
                    for(var i = 0; i < transportArr.length; i++)
                    {
                        var valg = document.createElement("option");
                        valg.text = transportArr[i].getId();
                        valg.value = i;
                        selectTransport.add(valg);
                    }
                }
            } 
        }
    }
    updateSelected();
}
  
function onChangeTransport()
{
    updateSelected();  
}

function updateSelected()
{
    var selectRoute = document.getElementById("selectRoute");
    var selectTransport = document.getElementById("selectTransport");
    
    if(selectRoute.length > 0 && selectTransport.length > 0)
    {
        if(selectedMarkerRoute != null && ROUTE_MANAGER[selectedMarkerRoute] != null)
            changeIcon( ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport], getMarkerIcon(ROUTE_MANAGER[selectedMarkerRoute].getTransportationType()));
        
        selectedMarkerRoute = selectRoute.options[selectRoute.selectedIndex].value;
        selectedMarkerTransport = selectTransport.options[selectTransport.selectedIndex].value;
        
        if(ROUTE_MANAGER[selectedMarkerRoute] != null)
            changeIcon( ROUTE_MANAGER[selectedMarkerRoute].getTransport()[selectedMarkerTransport], ikoner.selected);
    }
}

function setSelected(routeIndex, transportIndex)
{
    // Rydde opp i repitesjon senere yo
    var selectRoute = document.getElementById("selectRoute");
    var selectTransport = document.getElementById("selectTransport");
    
    if(routeIndex != null && transportIndex != null)
    {
        selectRoute.value = routeIndex;
        selectTransport.value = transportIndex;
    }
}

function changeCurrentMarker(vehicleId)
{
    if(ROUTE_MANAGER != null && ROUTE_MANAGER.length > 0)
    {
        for(var i = 0; i < ROUTE_MANAGER.length; i++)
        {
            if(ROUTE_MANAGER[i] != null)
            {
                var transport = ROUTE_MANAGER[i].getTransport();
                for(var j = 0; j < transport.length; j++)
                { 
                    if(transport[j].getId() == vehicleId)
                    {
                       setSelected(i, j);
                    }
                }    
            }
        }
    }    
}

function changeIcon(transport, icon)
{
    if(transport != null && icon != null)
    {
        transport.getMarker().setIcon(generateMapsIcon(icon, false));
    }
}

function generateMapsIcon(iconVal, erTransportType)
{
    var url;
    if(erTransportType)
        url = getMarkerIcon(iconVal);
    else
        url = iconVal;
     var ikon =
            {
                url: url, 
                scaledSize: new google.maps.Size(20, 24),
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(0, 0), 
                labelOrigin: new google.maps.Point(10, -10),
                rotation: 270
            };
    return ikon;
}

function getMarkerIcon(transType)
{
    console.log("Transporttype: " + transType);
    switch(transType)
    {
        case 1:
        case 2:
            return ikoner.buss;    
        break;

        case 5:
            return ikoner.baat;    
        break;
        
        case 6:
            return ikoner.tog;    
        break;
        
        case 7:
            return ikoner.trikk;    
        break;
        
        case 8:
            return ikoner.tbane;    
        break;
            
        default: 
            return ikoner.buss;
        break;
            
    }
}