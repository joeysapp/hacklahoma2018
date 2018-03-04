# encoding=utf8

import urllib, json

def clean(s):
    return s[1:-1]

def process(x):
    id_ = x["id"]
    name_ = "\"" + x["name"] + "\""
    #city_ = '"' + x["city"] + '"'
    city_ = ""
    DOB_ = x['DOB']
    address_ = "\"\""
    sex_ = ""
    lat_ = x["latitude"]
    lng_ = x["longitude"]
    state_ = ""

    
    if 'address' in x:
        address_ = "\"" + x['address'] + "\""
    if 'state' in x:
        state_ = x['state']
    if 'city' in x:
        city_ = x['city']
    if 'sex' in x:
        sex_ = x['sex']

    return (id_,name_.encode('ascii', 'ignore').decode('ascii'),
                sex_.encode('ascii', 'ignore').decode('ascii'),
                DOB_.encode('ascii', 'ignore').decode('ascii'),
                address_.encode('ascii', 'ignore').decode('ascii'),
                city_.encode('ascii', 'ignore').decode('ascii'),
                state_.encode('ascii', 'ignore').decode('ascii'),
                str(lat_),str(lng_))

def searchURL(start, end):
    return "https://v3v10.vitechinc.com/solr/v_us_participant/select?indent=on&q=id:[" + str(start) + "%20TO%20" + str(end) + "]&rows=50000&wt=json"

masterData = []

last_num = 0
cur_num = 1
for i in range(1000):
    url = searchURL(cur_num, cur_num+50000)
    response = urllib.urlopen(url)
    data = json.loads(response.read())
    myData = map(process, data["response"]["docs"])
    myData.sort(key = lambda x : int(x[0]))
    if len(myData) == 0 or last_num == cur_num:
        break
    else:
        print(myData[0][0], len(myData))
        masterData += myData
        last_num = cur_num
        cur_num = int(myData[-1][0]) + 1
    
print len(masterData)

fix_encoding = lambda s: str(s.decode('ascii', 'ignore').encode('ascii', 'ignore'))

filename = "v_us_participant.csv"
file = open(filename, "w")
for line in masterData:
    for i in range(9):
        if i == 0:
            file.write(str(line[i]))
        else:
            file.write(fix_encoding(line[i]))
        if i < 8:
            file.write(',')
    file.write("\n")
file.close()
