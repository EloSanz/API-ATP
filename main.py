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

def etl_dataset( df ):
    # Torque
    df['RPM'] = df['torque'].str.extract(r'(\d+)rpm', expand=False)
    df['RPM'].fillna(df['torque'].str.extract(r'(\d{1,3}(?:,\d{3})*)\(kgm@ rpm\)', expand=False), inplace=True)
    df['RPM'].fillna(df['torque'].str.extract(r'(\d+) RPM', expand=False), inplace=True)
    df['RPM'].fillna(df['torque'].str.extract(r'(\d+)  rpm ', expand=False), inplace=True)
    df['RPM'].fillna(df['torque'].str.extract(r'(\d+) rpm', expand=False), inplace=True)
    df['TORQUE'] = df['torque'].str.extract(r'(\d+)Nm@', expand=False)
    df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)nm@', expand=False), inplace=True)
    df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+) Nm', expand=False), inplace=True)
    df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)@', expand=False), inplace=True)
    df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)Nm', expand=False), inplace=True)
    df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)  Nm', expand=False), inplace=True)
    df['TORQUE'].fillna(df['torque'].str.extract(r'(\d+)NM@', expand=False), inplace=True)
    df['TORQUE'].fillna((df['torque'].str.extract(r'(\d{1,2}(?:[,.]\d{1,2})?)@\s*\d{1,3}(?:,\d{3})*\(kgm@ rpm\)', expand=False)).astype(float) * 9.8, inplace=True)
    df['TORQUE'].fillna((df['torque'].str.extract(r'(\d{1,2}(?:[,.]\d{1,2})?)\s*kgm', expand=False)).astype(float) * 9.8,inplace=True)
    df['RPM'] = df['RPM'].str.replace(',', '').astype(float)
    df['TORQUE'] = df['TORQUE'].astype(float)
    # Brand
    df['BRAND'] = df['name'].astype('str').apply(lambda x: x.split()[0])
    # Milage
    df['MILEAGE'] = (df['mileage'].apply(lambda x: str(x).replace(' kmpl', '').replace(' km/kg', ''))).astype(float)
    # Engine
    df['ENGINE'] = (df['engine'].apply(lambda x: str(x).replace(' CC', ''))).astype(float)
    # Max Power
    df['MAX_POWER'] = df['max_power'].astype(str).apply(lambda x: x.split()[0])
    df.drop(df[df['MAX_POWER'] == 'bhp'].index, inplace=True, axis=0)
    df['MAX_POWER'] = df['MAX_POWER'].astype(float)
    # Drop columns
    return df.drop(['torque', 'name', 'mileage', 'engine', 'max_power'], axis=1)

df_car = pd.read_csv('https://raw.githubusercontent.com/pokengineer/DataScience/main/datasets/car_price.csv')
print(df_car.head(5)) # name,year,selling_price,km_driven,fuel,seller_type,transmission,owner,mileage,engine,max_power,torque,seats

df_car = etl_dataset(df_car)
print(df_car.head(5))

# Identificamos las variables categóricas para crear dummies o incluirla de otra forma
categorical = [var for var in df_car.columns if df_car[var].dtype=='O']
print('las variables categoricas son:\n', categorical)
print("\nchequeamos la dimensionalidad de las variables")
for var in categorical:
    print(len(df_car[var].unique()), ' valores unicos en ', var )


cat_cols_count = len(categorical)
cat_rows = cat_cols_count // 3
cat_rows += 1 if cat_cols_count % 3 != 0 else 0  # Eğer sütun sayısı 3'e tam bölünmüyorsa bir ek satır oluştur.

fig, axes = plt.subplots(cat_rows, 3, figsize=(10, 10), squeeze=True)
axes = axes.flatten()

for i, col in enumerate(categorical):
    sns.countplot(data=df_car, x=col, ax=axes[i], order=df_car[col].value_counts().index)
    axes[i].set_xlabel(col)

plt.tight_layout()
plt.show()

# identificamos las variables numéricas
numerical = [var for var in df_car.columns if df_car[var].dtype!='O']
print('las variables numéricas son:\n', numerical)

for columna in numerical:
    df_car.plot(x=columna, y='selling_price',kind='scatter')
plt.show()

sns.heatmap(df_car[numerical].corr(), annot=True, fmt='.2f', linewidths=.5, cbar_kws={"shrink": .8})
plt.show()

# Verificamos si hay valores nulos para imputar
df_car.isnull().sum()

#PIPELINE
df_car.columns

X_car = df_car.drop(columns="selling_price")
y_car = df_car["selling_price"]
X_train, X_test, y_train, y_test = train_test_split(X_car, y_car,test_size=0.3, random_state=0)

X = ['TORQUE']
pl = Pipeline([
    ("selector", ColumnTransformer([("selector", "passthrough", X )], remainder="drop")),
    ("imputer",SimpleImputer(strategy="most_frequent")),
    ('scaler', StandardScaler(with_mean=True, with_std=True)),
    ('regressor', LinearRegression())
])

pl.fit( X_train, y_train )

#Regresion lineal simple

predicted = pl.predict(X_test)
pl['regressor'].n_features_in_

# score devuelve coeficiente de determinación, denominado R²
print( "R²: " + str( pl.score(X_test,y_test) ))

# Import matplotlib.pyplot
import matplotlib.pyplot as plt

# Create scatter plot
plt.scatter( X_test['TORQUE'],y_test, color="blue")

# Create line plot
plt.plot( X_test['TORQUE'],predicted,color="red")
plt.xlabel("TORQUE")
plt.ylabel("selling price")

# Display the plot
plt.show()