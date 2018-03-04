import csv
import json

deets = [[-1,-1,-1,-1,-1,-1,-1,-1]]

def fill_dt(start,filename): 
    with open(filename, 'rb') as csvfile:
        spamreader = csv.reader(csvfile)
        i = start
        for row in spamreader:
            id_ = int(row[0])
            emp_ = 0
            num_p_ = str(row[2])
            income_ = str(row[3])
            married_ = 0
            tobacco_ = 0
            
            if row[1] == "Employed":
                emp_ = 1
            if row[4] == "M":
                married_ = 1
            if row[5] != "No":
                tobacco_ = 1
                
            t = [id_,emp_,num_p_,income_,married_,tobacco_]
            
            if i < id_:
                while i < id_:
                    #print i, t[0]
                    deets.append([-1,-1,-1,-1,-1,-1])
                    i += 1
                deets.append(t)
                i += 1
            elif i == t[0]:
                deets.append(t)
                i += 1

fill_dt(1,'v_us_participant_detail_1.csv')
fill_dt(760011,'v_us_participant_detail_2.csv')

filename = "v_us_participant_detail_simpl.csv"
file = open(filename, "w")
for i in range(1,len(deets)):
    file.write(','.join(map(str,deets[i])))
    file.write('\n')
file.close()
