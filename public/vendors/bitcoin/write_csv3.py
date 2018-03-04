import csv
import json
from sets import Set

part = []
        
with open('v_us_combo_simpl.csv', 'rb') as csvfile:
    spamreader = csv.DictReader(csvfile)
    i = 1
    for row in spamreader:
        t = {
                'id' : int(row['id']),
                'bronze' : 0,
                'silver' : 0,
                'gold' : 0,
                'platinum' : 0,
                'lat' : row['lat'],
                'lng' : row['lng'],
                'city' : row['city'],
                'state' : row['state'],
                'paid' : float(row['paid'])
            }
        if float(row['paid']) - float(row['bronze']) < 0.5:
            t['bronze'] = 1
        elif float(row['paid']) - float(row['silver']) < 0.5:
            t['silver'] = 1
        elif float(row['paid']) - float(row['gold']) < 0.5:
            t['gold'] = 1
        else:
            t['platinum'] = 1
        part.append(t)
        i += 1

LL_city = {}
for p in part:
    cd = (p['lat'],p['lng'])
    city = (p['city'],p['state'])
    if cd not in LL_city:
        LL_city[cd] = { city : 1 }
    else:
        if city not in LL_city[cd]:
            LL_city[cd][city] = 1
        else:
            LL_city[cd][city] += 1

city_LL = {}
biggest_city = {}
for cd in LL_city.keys():
    max_city = ("","")
    max_ct = 0
    for city in LL_city[cd].keys():
        if LL_city[cd][city] > max_ct:
            max_ct = LL_city[cd][city]
            max_city = city
    biggest_city[cd] = max_city
    city_LL[max_city] = cd

with open('LL_bigcities.csv', 'w') as outfile:
    for cd in biggest_city.keys():
        outfile.write(cd[0] + "," + cd[1] + "," + biggest_city[cd][0] + "," + biggest_city[cd][1] + "\n")
