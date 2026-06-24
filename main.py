from PIL import GimpGradientFile
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

from sklearn.linear_model import LinearRegression

from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from sklearn import metrics

def main():
    df_car = pd.read_csv('https://raw.githubusercontent.com/pokengineer/DataScience/main/datasets/car_price.csv')
    print(df_car.head(5)) # name,year,selling_price,km_driven,fuel,seller_type,transmission,owner,mileage,engine,max_power,torque,seats
    
    df_car = etl_dataset(df_car)
    print(df_car.head(5))

def etl_dataset( df ):
    # Torque
    df['RPM'] = df['torque'].str.extract(r'(\d+)rpm', expand=False)
    df['RPM'] = df['RPM'].fillna(df['torque'].str.extract(r'(\d{1,3}(?:,\d{3})*)\(kgm@ rpm\)', expand=False))
    df['RPM'] = df['RPM'].fillna(df['torque'].str.extract(r'(\d+) RPM', expand=False))
    df['RPM'] = df['RPM'].fillna(df['torque'].str.extract(r'(\d+)  rpm ', expand=False))
    df['RPM'] = df['RPM'].fillna(df['torque'].str.extract(r'(\d+) rpm', expand=False))
    
    df['TORQUE'] = df['torque'].str.extract(r'(\d+)Nm@', expand=False)
    df['TORQUE'] = df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)nm@', expand=False))
    df['TORQUE'] = df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+) Nm', expand=False))
    df['TORQUE'] = df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)@', expand=False))
    df['TORQUE'] = df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)Nm', expand=False))
    df['TORQUE'] = df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)  Nm', expand=False))
    df['TORQUE'] = df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)NM@', expand=False))
    
    df['TORQUE'] = df['TORQUE'].astype(float)
    df['TORQUE'] = df['TORQUE'].fillna((df['torque'].str.extract(r'(\d{1,2}(?:[,.]\d{1,2})?)@\s*\d{1,3}(?:,\d{3})*\(kgm@ rpm\)', expand=False)).astype(float) * 9.8)
    df['TORQUE'] = df['TORQUE'].fillna((df['torque'].str.extract(r'(\d{1,2}(?:[,.]\d{1,2})?)\s*kgm', expand=False)).astype(float) * 9.8)
    
    df['RPM'] = df['RPM'].str.replace(',', '').astype(float)
    # Brand
    df['BRAND'] = df['name'].astype('str').apply(lambda x: x.split()[0])
    # Milage
    df['MILEAGE'] = (df['mileage'].apply(lambda x: str(x).replace(' kmpl', '').replace(' km/kg', ''))).astype(float)
    # Engine
    df['ENGINE'] = (df['engine'].apply(lambda x: str(x).replace(' CC', ''))).astype(float)
    # Max Power
    df['MAX_POWER'] = df['max_power'].astype(str).str.split().str[0]
    df = df.drop(df[df['MAX_POWER'] == 'nan'].index, axis=0)
    df = df.drop(df[df['MAX_POWER'] == 'bhp'].index, axis=0)
    df['MAX_POWER'] = df['MAX_POWER'].astype(float)
    # Drop columns
    return df.drop(['torque', 'name', 'mileage', 'engine', 'max_power'], axis=1)

if __name__ == "__main__":
    main()