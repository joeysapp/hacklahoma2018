import csv
import json
from dateutil.relativedelta import *
from dateutil.parser import *

dummy = (-1,-1)
quot = [dummy]
dt_s = [dummy]
part =[dummy]

with open('v_us_quotes.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    i = 1
    for row in spamreader:
        t = (int(row[0]),float(row[1]),float(row[2]),
             float(row[3]),float(row[4]),float(row[5]))
        
        if i < t[0]:
            while i < t[0]:
                quot.append(dummy)
                i += 1
            quot.append(t)
            i += 1
        elif i == t[0]:
            quot.append(t)
            i += 1
        
with open('v_us_participant_detail_simpl.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    i = 1
    for row in spamreader:
        t = (int(row[0]),int(row[1]),int(row[2]),
             int(row[3]),int(row[4]),int(row[5]))
            
        if i < t[0]:
            while i < t[0]:
                dt_s.append(dummy)
                i += 1
            dt_s.append(t)
            i += 1
        elif i == t[0]:
            dt_s.append(t)
            i += 1

now = parse("2018-03-04T00:00:00Z")
with open('v_us_participant.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile)
    i = 1
    for row in spamreader:
        id_ = int(row[0])
        if id_ == -1 or quot[id_][0] == -1 or dt_s[id_][0] == -1:
            part.append(dummy)
            i += 1
        else:
            try:
                dob_ = parse(row[3])
                age_ = relativedelta(now,dob_).years
                city_ = row[-4]
                state_ = row[-3]
                lat_ = int(row[-2])
                lng_ = int(row[-1])
                sex_ = 1
                if row[2] == 'F':
                    sex_ = 0
                t = (id_,sex_,age_,
                     quot[id_][1],quot[id_][2],
                     quot[id_][3],quot[id_][4],quot[id_][5],
                     dt_s[id_][1],dt_s[id_][2],
                     dt_s[id_][3],dt_s[id_][4],dt_s[id_][5],
                     city_,state_,lat_,lng_)
                if i < t[0]:
                    while i < t[0]:
                        part.append(dummy)
                        i += 1
                    part.append(t)
                    i += 1
                elif i == t[0]:
                    part.append(t)
                    i += 1
            except Exception as ex:
                print row[0], row[3]

schema = ["id","sex","age","bronze","silver","gold","platinum","paid",
          "employed","number_people","income","married","tobacco",
          "city","state","lat","lng"]
sch_str = ",".join(schema)

filename = "v_us_combo_simpl.csv"
file = open(filename, "w")
file.write(sch_str)
file.write("\n")
for p in part:
    if p[0] != -1:
        file.write(','.join(map(str,list(p))))
        file.write('\n')
file.close()
