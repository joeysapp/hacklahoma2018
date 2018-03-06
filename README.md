# vquery
Hackathon at University of Oklahoma 2018
Team: @brucezheng, @joeysapp

## Summary
vquery is a web-based visualization of a dummy insurance data set. We provie a straightforward UX to query this data. The height of each line is determined by the amount of insurance policies that have been sold in the area. 

## Technical Details
Written and developed using primarily Javascript, __vquery__ utilizes multiple frameworks such as _node_, _express_, _p5.js_ and _socket.io_. These allowed us to develop for multiple platforms while having quick turn-over time.

A user visiting vquery is greeted by a projection of our globe with a panel of search options. The dataflow is as follows:
1. _jquery_ specify options (optional)
1. _jquery_ press go!
1. _js_ client-side socket emit
1. _js-node_ server-side on-receive send db response
1. _js_ client-side on-receive store db response
	1. jsonify lat/long
	1. lat/long -> x,y,z
	1. calculate normals, heights of line
1. _p5.js_ draws globe and current data

Upon querying your local browser instance, the options are sent from the client to our **node.js** instance running in the background. This is accomplished using web sockets.

After this our query is handed off to a relational database implemented using an NPM package fast-csv. The result is sent via web sockets back to the client and we compute which points to display on the globe. 

Our reach goal was to implement a fully-functional location system (i.e. search based on area) but are providing a histogram of the requested area using Vitech's dataset. 