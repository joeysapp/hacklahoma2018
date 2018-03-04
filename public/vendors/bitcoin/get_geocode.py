import csv
import json
from sets import Set
import geocoder

places = []
        
with open('bigplaces.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    i = 1
    for row in spamreader:
        places.append([row[0],row[1]])

outputs = []
i = 0
for p in list(places):
    #if i > 10:
    #    break
    i += 1
    search = p[0] + ", " + p[1]
    g = geocoder.arcgis(search)
    outputs.append([p[0],p[1],str(g.json['lat']),str(g.json['lng'])])
    if i % 5 == 0:
        print i

#for x in outputs:
#    print ','.join(x)


with open('bigplaces_latlng.csv', 'w') as outfile:
    for o in outputs:
        outfile.write(','.join(o) + "\n")
