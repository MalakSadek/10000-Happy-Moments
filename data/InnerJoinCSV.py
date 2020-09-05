import pandas as pd

df1 = pd.read_csv('cleaned_hm.csv')
df2 = pd.read_csv('demographic.csv')

df3 = df1.merge(df2, how='inner', on='wid')

df3.to_csv("combinedData.csv")




