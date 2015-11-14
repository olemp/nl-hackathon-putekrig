var app = angular.module('trip', ['uiGmapgoogle-maps']);
app.constant("PARSE_CREDENTIALS", {
        APP_ID: "phPAJ180mxVmSU4CYKnw3xmP1zRl8vQSIiH7XScq",
		REST_API_KEY: "AEzRWXLnF6cYeggFRK56JoDKnYUHUV9bcjnIrTfA"
})
app.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true
        });
    }]
)
app.factory('Parse',['$http','PARSE_CREDENTIALS',function($http,PARSE_CREDENTIALS){
	var baseUrl = 'https://api.parse.com/1/classes/';
	return {
		provider:function(type) {
			return {
				getAll:function(){
					return $http.get(getUrl(type),getParams());
				},
				get:function(id){
					return $http.get(getUrl(type)+id,getParams());
				},
				create:function(data){
					return $http.post(getUrl(type),data,getParams());
				},
				edit:function(id,data){
					return $http.put(getUrl(type)+id,data,getParams());
				},
				delete:function(id){
					return $http.delete(getUrl(type)+id,getParams());
				}
			}
			function getUrl(type) {
				return baseUrl+type;
			}
	
			function getParams() {
				return {
						headers:{
							'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
							'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
							'Content-Type':'application/json'
					}      
				}    
			}
	
		}
	}
}])
app.controller('tripCtrl', function($scope, Parse) {
	$scope.map = { 
		center: { latitude: 45, longitude: -73 }, 
		zoom: 8
	};
	
     Parse.provider('Trip/').get(document.location.pathname.split("/").slice(-1)[0])
	.success(function(data) {
		$scope.trip = data;
	}).
	error(function(response) {
		
	});
});