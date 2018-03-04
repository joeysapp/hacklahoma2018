import csv
import json
from sets import Set
import geocoder

places = Set()
with open('bigplaces.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        places.add((row[0],row[1]))

LL_big = {}
with open('LL_bigcities.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        LL_big[(int(row[0]),int(row[1]))] = (row[2],row[3])

big_LL = {}
with open('bigplaces_latlng.csv') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        big_LL[(row[0],row[1])] = (float(row[2]),float(row[3]))

i = 0
with open('v_us_combo_simpl.csv', 'rb') as inp:
    with open('v_us_combo_big_short.csv', 'wb') as out:
        writer = csv.DictWriter(out,fieldnames=["id","sex","age","bronze","silver","gold","platinum","paid","employed","number_people","income","married","tobacco","city","state","lat","lng"])
        writer.writeheader()
        reader = csv.DictReader(inp)
        for row in reader:
            filter_row = row
            big_city = LL_big[(int(filter_row['lat']),int(filter_row['lng']))]
            filter_row['city'] = big_city[0]
            filter_row['state'] = big_city[1]
            true_LL = big_LL[big_city]
            filter_row['lat'] = true_LL[0]
            filter_row['lng'] = true_LL[1]
            
            if (filter_row['city'],filter_row['state']) in places:
                if i % 1000 == 0:
                    writer.writerow(row)
                i += 1
