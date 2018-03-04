import csv
import json
from sets import Set
import geocoder

places = Set()

with open('bigplaces.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        places.add((row[0],row[1]))

i = 0
with open('v_us_combo_simpl.csv', 'rb') as inp:
    with open('v_us_combo_big.csv', 'wb') as out:
        writer = csv.DictWriter(out,fieldnames=["id","sex","bronze","silver","gold","platinum","paid","employed","number_people","income","married","tobacco","city","state","lng","lat"])
        writer.writeheader()
        reader = csv.DictReader(inp)
        for row in reader:
            if (row['city'],row['state']) in places:
                writer.writerow(row)
                i += 1
