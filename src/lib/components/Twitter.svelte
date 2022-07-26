<script>
const endpointURL = "http://127.0.0.1:5173/api/twitter.json"

fetch(endpointURL, { 
  method: 'GET'
})
.then(function(response) { return response.json(); })
.then(function(json) {
  console.log(json['data']);
});
</script>

<h1>Hello world!</h1>
