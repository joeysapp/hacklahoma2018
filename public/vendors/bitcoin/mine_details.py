import urllib, json

def clean(s):
    return s[1:-1]

fix_encoding = lambda s: str(s.encode('utf-8', 'ignore'))

def process(x):
    id_ = x["id"]
    employ_ = x["EMPLOYMENT_STATUS"]
    num_people_ = x['PEOPLE_COVERED']
    annual_income_ = x['ANNUAL_INCOME']
    married_ = x["MARITAL_STATUS"]
    height_ = x["HEIGHT"]
    weight_ = x["WEIGHT"]
    tobacco_ = x["TOBACCO"]
    pre_ = ""
    if 'PRE_CONDITIONS' in x:
        pre_ = x["PRE_CONDITIONS"].encode('ascii', 'ignore').decode('ascii')
    return (id_,employ_.encode('ascii', 'ignore').decode('ascii'),
                str(num_people_),str(annual_income_),
                married_.encode('ascii', 'ignore').decode('ascii'),
                str(height_),str(weight_),
                tobacco_.encode('ascii', 'ignore').decode('ascii'),
                pre_)

def searchURL(start, end):
    return "https://v3v10.vitechinc.com/solr/v_us_participant_detail/select?indent=on&q=id:[" + str(start) + "%20TO%20" + str(end) + "]&rows=10000&wt=json"

masterData = []

last_num = 0
cur_num = 760011
for i in range(750):
    url = searchURL(cur_num, cur_num+10000)
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
    if len(masterData) > 750000:
        break
    
print len(masterData)
print masterData[-1][0]

filename = "v_us_participant_detail_2.csv"
file = open(filename, "w")
for line in masterData:
    for i in range(9):
        if i == 0:
            file.write(str(line[i]))
        else:
            file.write(fix_encoding(line[i]))
        file.write(',')
    file.write("\n")
file.close()
