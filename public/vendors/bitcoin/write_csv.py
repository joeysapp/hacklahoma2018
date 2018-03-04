import csv
import json

part = [(-1,-1,-1,-1,-1,-1,-1,-1)]
quot = [(-1,-1,-1,-1,-1,-1)]

with open('v_us_quotes.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    i = 1
    for row in spamreader:
        t = (int(row[0]),float(row[-2]))
        if row[-1] == "Bronze":
            t = (int(row[0]),float(row[-2]),1,0,0,0)
        elif row[-1] == "Silver":
            t = (int(row[0]),float(row[-2]),0,1,0,0)
        elif row[-1] == "Gold":
            t = (int(row[0]),float(row[-2]),0,0,1,0)
        else:
            t = (int(row[0]),float(row[-2]),0,0,0,1)
            
        if i < t[0]:
            while i < t[0]:
                quot.append((-1,-1,-1,-1,-1,-1))
                i += 1
            quot.append(t)
            i += 1
        elif i == t[0]:
            quot.append(t)
            i += 1
        
with open('v_us_participant.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    i = 1
    for row in spamreader:
        t = (int(row[0]),int(row[-3]),int(row[-2]),
             quot[int(row[0])][1],
             quot[int(row[0])][2],
             quot[int(row[0])][3],
             quot[int(row[0])][4],
             quot[int(row[0])][5])
        if i < t[0]:
            while i < t[0]:
                #print i, t[0]
                part.append((-1,-1,-1,-1,-1,-1,-1,-1))
                i += 1
            part.append(t)
            i += 1
        elif i == t[0]:
            part.append(t)
            i += 1

coord_price = {}
coord_type = {}
cd_count = {}
cd_avg_price = {}
cd_avg_type = {}

for p in part:
    if p[0] != -1:
        cd = (p[1],p[2])
        cost = p[3]
        if cd in coord_price:
            coord_price[cd].append(cost)
        else:
            coord_price[cd] = [cost]
            
        bsgp = [p[4],p[5],p[6],p[7]]
        if cd in coord_type:
            coord_type[cd][0] += bsgp[0]
            coord_type[cd][1] += bsgp[1]
            coord_type[cd][2] += bsgp[2]
            coord_type[cd][3] += bsgp[3]
        else:
            coord_type[cd] = bsgp

for cd in coord_price.keys():
    l = coord_price[cd]
    avg = reduce(lambda x, y: x + y, l) / float(len(l))
    cd_avg_price[cd] = avg
    cd_count[cd] = len(l)

for cd in coord_type.keys():
    l = coord_type[cd]
    total = float(l[0] + l[1] + l[2] + l[3])
    b = float(l[0]) / total
    s = float(l[1]) / total
    g = float(l[2]) / total
    p = float(l[3]) / total
    avg = [b,s,g,p]
    cd_avg_type[cd] = avg

cd_price_list = []
for cd in cd_avg_price.keys():
    cd_price_list.append({"lng":cd[0],"lat":cd[1],"num":cd_count[cd],"avg_cost":cd_avg_price[cd],
                          "bronze":cd_avg_type[cd][0],"silver":cd_avg_type[cd][1],
                          "gold":cd_avg_type[cd][2],"platinum":cd_avg_type[cd][3]})

cd_price_list.sort()
data = {"list" : cd_price_list}
with open('data.json', 'w') as outfile:
    json.dump(data, outfile)

print len(cd_avg_price.keys())
