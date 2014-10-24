#Unsplash Scraper

##What it do
This simple script scrapes the ten newest images on unsplash.com, an attribution-free pretty image tumblr, a great resource for FEDs and designers.  This way you won't have to go through and download this week's images manually, just run the script.

This is also my first web scraper in node.  Fun stuff.

2014-10-13 / Jeff Holman
1. Retry up to 5 times if there is an issue for a particular image. The server was refusing my requests some times.
2. cURL was throwing errors because of the query string in the URL, so I strip these off before requesting the URL.
3. I'm pulling images from the /grid view, so I can grab more images at once.
4. I don't re-download images I've already downloaded.
