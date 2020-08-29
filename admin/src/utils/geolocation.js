import AMap from 'AMap'

export const location = {
    asa() {
        AMap.plugin('AMap.CitySearch', function () {
            var citySearch = new AMap.CitySearch();
            citySearch.getLocalCity(function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    // 查询成功，result即为当前所在城市信息
                    let province = result.province;
                    let city = result.city;
                }
            })
        })
    },
    initMap(id){
        let mapObj = new AMap.Map(id, {})
        let geolocation;
        mapObj.plugin(['AMap.Geolocation'], function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //  是否使用高精度定位，默认:true
                timeout: 10000, //  超过10秒后停止定位，默认：无穷大
                maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true, //  显示定位按钮，默认：true
                buttonPosition: 'LB',  // 定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            })
            mapObj.addControl(geolocation)
            geolocation.getCurrentPosition()
        })
        return geolocation;
    },
    //解析定位结果
    onComplete(data) {
        // document.getElementById('status').innerHTML='定位成功'
        var str = [];
        str.push('定位结果：' + data.position);
        str.push('定位类别：' + data.location_type);
        if (data.accuracy) {
            str.push('精度：' + data.accuracy + ' 米');
        }//如为IP精确定位结果则没有精度信息
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
        alert('定位成功' + str)
        // document.getElementById('result').innerHTML = str.join('<br>');
    },
    //解析定位错误信息
    onError(data) {
        alert('定位失败' + data.message)
        // document.getElementById('status').innerHTML='定位失败'
        // document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
    },
}