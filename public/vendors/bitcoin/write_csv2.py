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

p_price = {}
p_type = {}
p_count = {}

p_avg_price = {}
p_prop_type = {}

for p in part:
    cd = (p['lat'],p['lng'])
    bigger = biggest_city[cd]
    p['city'] = bigger[0]
    p['state'] = bigger[1]

for p in part:
    place = (p['city'],p['state'])
    paid = p['paid']

    if place in p_price:
        p_price[place].append(paid)
    else:
        p_price[place] = [paid]

    if place in p_type:
        for key in p_type[place].keys():
            p_type[place][key] += p[key]
    else:
        p_type[place] = { 'bronze': p['bronze'],
                          'silver': p['silver'],
                          'gold': p['gold'],
                          'platinum': p['platinum'] }

for place in p_price.keys():
    prices = p_price[place]
    avg = reduce(lambda x, y: x + y, prices) / float(len(prices))
    p_avg_price[place] = avg
    p_count[place] = len(prices)

for place in p_type.keys():
    type_count = p_type[place]
    total = float(type_count['bronze'] + type_count['silver'] +
                  type_count['gold'] + type_count['platinum'])
    prop = {}
    prop['bronze'] = float(type_count['bronze']) / total
    prop['silver'] = float(type_count['silver']) / total
    prop['gold'] = float(type_count['gold']) / total
    prop['platinum'] = float(type_count['platinum']) / total
    p_prop_type[place] = prop

true_LL = {}
with open('bigplaces_latlng.csv') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        true_LL[(row[0],row[1])] = (float(row[2]),float(row[3]))
        
json_list = []
for place in p_price.keys():
    prop = p_prop_type[place]
    element = {
                    'city' : place[0],
                    'state' : place[1],
                    'num' : p_count[place],
                    'avg_cost' : p_avg_price[place],
                    'bronze' : prop['bronze'],
                    'silver' : prop['silver'],
                    'lat' : true_LL[place][0],
                    'lng' : true_LL[place][1],
                    'gold' : prop['gold'],
                    'platinum' : prop['platinum']
            }
    if len(place[1]) > 0:
        json_list.append(element)

json_list.sort(key = lambda x: (x['state'],x['city']))
data = {"list" : json_list}
with open('data_normal.json', 'w') as outfile:
    json.dump(data, outfile)

print len(json_list)

bigcities = list(Set(list(map(lambda x: biggest_city[x][0] + "," + biggest_city[x][1], biggest_city.keys()))))

with open('bigplaces.csv', 'w') as outfile:
    for p in bigcities:
        outfile.write(p + "\n")
