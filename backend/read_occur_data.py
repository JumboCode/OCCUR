import csv 
import json
import re

def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        location_keys = ['street_address', 'city', 'state', 'zip_code']
        csvReader = csv.DictReader(csvf)
        #convert each csv row into python dict
        for row in csvReader: 
            #add this python dict to json array

            recurrenceDays_str = row.pop('recurrenceDays')
            recurrenceDays = re.split(' ',recurrenceDays_str)
            row['recurrenceDays'] = recurrenceDays

            # Convert null strings to None
            for key,item in row.items():
                if key == 'location' and item == "null":
                    row[key] = {}
                elif item == "null":
                    row[key] = None

            if row['location']:
                # handle nested location data
                location_str = row.pop('location')
                # location_data_list = location_str.split(";")
                location_data_list = re.split(', ',location_str)
                location = {}
                for i, item in enumerate(location_data_list):
                    location[location_keys[i]] = item
                row['location'] = location



            
            jsonArray.append(row)
  
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
          

csvFilePath = r'alameda_county_resources.csv'
jsonFilePath = r'alameda_county_resources.json'
csv_to_json(csvFilePath, jsonFilePath)