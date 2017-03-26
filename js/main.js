function show_relevant(text) {
    $('#pubs').children().each(function(i, e) {
        var elem = $(e);
        var kind = elem.attr('data-kind');
        var topics = elem.attr('data-topic');
        if (text == false || (kind && kind.indexOf(text) > -1)
            || (topics && topics.indexOf(text) > -1)) {
            elem.css('display', 'list-item');
        } else {
            elem.css('display', 'none');
        }
    });
    if(text) {
        $('#filter-string').text('(' + text + ')');
    } else {
        $('#filter-string').text('');
    }
}
$(function() { 
    var pubs = $('#pubs');
    var all_topics = {};
    var active = '';
    var all_kinds = {};
    pubs.children().each(function(i, e) {
        var elem = $(e);
        var kind = elem.attr('data-kind');
        if (kind) {
            elem.children('.tags').append(
                $("<span class='filter-btn filter-kind'>" 
                    + kind + "</span>"));
            all_kinds[kind] = 1;
        }
        var topics = elem.attr('data-topic');
        if (topics) {
            $.each(topics.split(','), function(d, v) {
                elem.children('.tags').append(
                    $("<span class='filter-btn filter-topic'>" 
                        + v + "</span>"));
                all_topics[v] = 1;
            });
        }
    });
    $('.filter-btn').on('click', function(e) {
        var text = $.text(e.target);
        $('.filter-btn').removeClass('active');
        $('#pubs-intro').css('display', 'none');
        if (text == active) {
            show_relevant(false);
            active = '';
            $('.pub-details').css('display', 'none');
            $('.pub-quickdetails').css('display', 'inline');
        } else {
            show_relevant(text);
            active = text;
            $(e.target).addClass('active');
            $('.pub-details').css('display', 'none');
            $('.pub-quickdetails').css('display', 'inline');
        }
    });
    $('#arch').on('mouseover', function(e) {
        $('#me-image').css('background-image', "url(img/architect.jpg)");
    });

    $('#arch').on('mouseout', function(e) {
        $('#me-image').css('background-image', "url(img/me.jpg)");
    });
    $('.emaillink').on('click', function(e) {
        $('.full-email').fadeTo(400, 0.4, function() { $('.full-email').fadeTo(200, 1); });
        return false;
    });
    $('.pub-link').on('click', function(e) {
        $(e.target.parentNode).children('.pub-details').toggle()
        $(e.target.parentNode).children('.pub-quickdetails').toggle()
        return false;
    });
    var decoded_email = Base64.decode('PHN0cm9uZz5FbWFpbDo8L3N0cm9uZz4gPHNwYW4gY2xhc3M9ImVtYWlsIj5sdWNhcyBhdCBsdWNhc3dheWUuY29tPC9zcGFuPjxicj4=');
    $('.full-email').html(decoded_email);
    show_relevant('Recent');

    $(window).resize(function () {
        if ($(window).width() <= 630) {
            show_relevant(false);
        }
    });
    if ($(window).width() <= 630) {
        show_relevant(false);
    }

    var map;
    var boston = new google.maps.LatLng(42.360170, -71.058581);
    var united_states = new google.maps.LatLng(39.8282, -98.5795);

    var MY_MAPTYPE_ID = 'custom_style';

    function initialize() {
        var featureOpts = [
            {
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "stylers": [
                    {
                        "hue": "#DEF1F2"
                    },
                    {
                        "saturation": -50
                    },
                    {
                        "gamma": 2.15
                    },
                    {
                        "lightness": 12
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 24
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 57
                    }
                ]
            }
        ];
        
        var mapOptions = {
            zoom: 3,
            center: united_states,
            disableDefaultUI: true,
            scrollwheel: false,
            zoomControl: true,
            backgroundColor: '#DEF1F2',
            mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
            },
            mapTypeId: MY_MAPTYPE_ID
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

        var styledMapOptions = {
            name: 'National Parks'
        };

        var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
        map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

        function makeContent(str) {
            return '<div id="content">' + str + '</div>';
        }

        var marker = new google.maps.Marker({
            position: boston,
            title: 'Home (Boston, MA)',
            icon: 'http://maps.google.com/mapfiles/kml/pal3/icon31.png',
            map: map
        });
        marker.addListener('click', function() {
            new google.maps.InfoWindow({
              content: makeContent('Home (Boston, MA)'),
              maxWidth: 200
            }).open(map, marker);
        });

        function makeMarker(lon,lat,place, seen) {
            var loc = new google.maps.LatLng(lat,lon);

            var marker = new google.maps.Marker({
                position: loc,
                title:place,
                // animation: google.maps.Animation.DROP,
                icon: seen ? 'http://maps.google.com/mapfiles/ms/icons/grn-pushpin.png' : 'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png',
                map: map
            });
            marker.addListener('click', function() {
                new google.maps.InfoWindow({
                  content: makeContent(place),
                  maxWidth: 200
                }).open(map, marker);
            });
        }
        markers = [
            [-68.2733345,44.3384602, 'Acadia National Park', true],
            [-109.5927429,38.7334646, 'Arches National Park', true],
            [-102.3400497,43.855326, 'Badlands National Park', false],
            [-103.2424736,29.127572, 'Big Bend National Park', false],
            [-80.2084351,25.4821764, 'Biscayne National Park', false],
            [-107.74189,38.5752796, 'Black Canyon of the Gunnison National Park', false],
            [-112.1874046,37.5931516, 'Bryce Canyon National Park', true],
            [-109.8782158,38.3265751, 'Canyonlands National Park', true],
            [-111.2618065,38.3666946, 'Capitol Reef National Park', false],
            [-104.5567131,32.1475657, 'Carlsbad Caverns National Park', false],
            [-119.8586082,33.9987388, 'Channel Islands National Park', false],
            [-80.7786942,33.7956969, 'Congaree National Park', false],
            [-122.1684837,42.8687932, 'Crater Lake National Park', true],
            [-81.5681648,41.2809026, 'Cuyahoga Valley National Park', false],
            [-117.07958220000002,36.5054968, 'Death Valley National Park', true],
            [-150.5030823,63.33426180000001, 'Denali National Park &amp; Preserve', false],
            [-82.8727913,24.6287613, 'Dry Tortugas National Park', false],
            [-80.8990288,25.286766, 'Everglades National Park', false],
            [-153.3255386,67.6854069, 'Gates of the Arctic National Park', false],
            [-113.787117,48.7595838, 'Glacier National Park', true],
            [-136.9004631,58.66587010000001, 'Glacier Bay National Park &amp; Preserve', false],
            [-112.1134186,36.107092, 'Grand Canyon National Park', true],
            [-110.6817627,43.7904282, 'Grand Teton National Park', true],
            [-114.29986950000001,38.9832981, 'Great Basin National Park', true],
            [-105.5944061,37.79147280000001, 'Great Sand Dunes National Park &amp; Preserve', true],
            [-83.5498238,35.6116739, 'Great Smoky Mountains National Park', false],
            [-104.8687935,31.903938400000005, 'Guadalupe Mountains National Park', false],
            [-156.1550331,20.7203137, 'Haleakala National Park', true],
            [-155.199995,19.3832593, 'Hawaii Volcanoes National Park', true],
            [-93.0641556,34.5314498, 'Hot Springs National Park', false],
            [-88.9092636,47.9958954, 'Isle Royale National Park', false],
            [-115.9011269,33.8732661, 'Joshua Tree National Park', true],
            [-155.1988792,59.0998464, 'Katmai National Park &amp; Preserve', false],
            [-149.8162651,60.0438465, 'Kenai Fjords National Park', false],
            [-118.5555267,36.8875843, 'King\'s Canyon National Park', false],
            [-159.4502449,67.4102569, 'Kobuk Valley National Park', false],
            [-154.3033218,60.4300365, 'Lake Clark National Park &amp; Preserve', false],
            [-121.42089840000001,40.4980061, 'Lassen Volcanic National Park', false],
            [-86.1005402,37.1871256, 'Mammoth Cave National Park', false],
            [-108.4620094,37.2304651, 'Mesa Verde National Park', true],
            [-121.727314,46.88002440000001, 'Mt. Rainier National Park', true],
            [-170.6835937,-14.2582274, 'National Park of American Samoa', false],
            [-121.2985039,48.771917, 'North Cascades National Park', false],
            [-123.49834439999998,47.9691231, 'Olympic National Park', false],
            [-109.7819996,35.0661136, 'Petrified Forest National Park', false],
            [-121.18280410000001,36.4904554, 'Pinnacles National Park', true],
            [-124.00285699999999,41.2143025, 'Redwood National &amp; State Parks', true],
            [-105.68367,40.343142400000005, 'Rocky Mountain National Park', true],
            [-111.1665344,32.2968551, 'Saguaro National Park', false],
            [-118.5615346,36.4806541, 'Sequoia National Park', true],
            [-78.6797905,38.2924965000, 'Shenandoah National Park', false],
            [-103.5384178,46.9789641, 'Theodore Roosevelt National Park', false],
            [-64.7482681,18.3423055, 'Virgin Islands National Park', false],
            [-92.8272629,48.4837318, 'Voyageurs National Park', false],
            [-103.4213448,43.6047591, 'Wind Cave National Park', false],
            [-142.9855156,61.71038049999999, 'Wrangell-St. Elias National Park &amp; Preserve', false],
            [-110.5883789,44.4276507, 'Yellowstone National Park', true],
            [-119.53863139999999,37.8650966, 'Yosemite National Park', true],
            [-113.0266571,37.298227, 'Zion National Park', true]

        ];
        var seen = 0;
        for (var i = markers.length - 1; i >= 0; i--) {
            makeMarker(markers[i][0], markers[i][1], markers[i][2], markers[i][3]);
            if (markers[i][3]) seen++;
        }
        $('#seencounter').text('(' + seen + '/' + markers.length + ')');
    }
    //google.maps.event.addDomListener(window, 'load', initialize);

    $('#checklist-show').click(function() {
        $('#checklist').css('display', 'block');
        initialize();
        return false;
    });

    $('body').ready(function() {
        $img = $('<img src="img/IMG_4834.jpg">');
        $img.on('load', function() {
            $('#status').css('display', 'none');
            $('#loading').css('opacity', '0');
        });
        if ($img[0].complete) {
          $img.load();
        }
    })

});

