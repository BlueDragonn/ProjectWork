window.addEventListener("load", LoadInfoAboutSong);
document.getElementById("getInfo").addEventListener("click", LoadInfoAboutSong);

function LoadInfoAboutSong()
{
	let data = new XMLHttpRequest()
	
	data.open('GET', "./data", true);

	data.onload = function() {
		if(data.status === 200)
		{
			console.log('success')
			let test = JSON.parse(this.response);
            console.log(test.body.item.album.images[0].url);
            document.getElementById("artist").innerHTML = test.body.item.artists[0].name;
            document.getElementById("song").innerHTML =  test.body.item.name;
            document.getElementById("cover").src =  test.body.item.album.images[0].url;
		}
		else 
		{
			console.log("Error");
        }
		
	}
	
	data.send();
	
}