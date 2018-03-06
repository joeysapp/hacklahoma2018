# vquery
Hackathon at University of Oklahoma 2018
Team: @brucezheng, @joeysapp

## Summary
vquery is a web-based visualization of a dummy insurance data set. We provie a straightforward UX to query this data. The height of each line is determined by the amount of insurance policies that have been sold in the area. 

## Technical Details
Written and developed using primarily Javascript, __vquery__ utilizes multiple frameworks such as _node_, _express_, _p5.js_ and _socket.io_. These allowed us to develop for multiple platforms while having quick turn-over time.

A user visiting vquery is greeted by a projection of our globe with a panel of search options. The dataflow is as follows:
```
1. jquery:		specify options (optional)
2. jquery: 		press go!
3. javascript:		client-side socket emit
4. node:		server-side on-receive send db response
5. javascript:		client-side on-receive store db response
			* jsonify lat/long
			* lat/long -> x,y,z
			* calculate normals, heights of line
6. p5.js:		draws globe and current data
```

Upon querying your local browser instance, the options are sent from the client to our _node.js_ instance running in the background using _socket.io_.

After this our query is handed off to a relational database implemented using an _npm_ package fast-csv. The result is sent via _socket.io_ back to the client and stored. This data is then translated to cartesian x, y, z coordinates.

We had planned to implement a fully-functional location system (i.e. search based on area) using _geojson_ but did not finish this. The location form uses an autocomplete form _autocmplete_.