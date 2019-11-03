#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import datetime as dt
import matplotlib.pyplot as plt
import webbrowser 
import numpy as np


# In[2]:


potenciaActual1=45
potenciaActual2=45
potenciaActual3=45


# In[3]:


CUPS = 'potencias'


# In[4]:


df_sips = pd.read_excel('B:/Documentos/SADCA/prueba-llamada-python/dist/public/' + CUPS + '.xlsx')


# In[5]:


df_sips['fechaInicio'] = pd.to_datetime(df_sips['fechaInicio'], format=('%d/%m/%Y'))
df_sips['fechaFin'] = pd.to_datetime(df_sips['fechaFin'], format=('%d/%m/%Y'))


# In[6]:


df_sips['dias'] = df_sips['fechaFin'] - df_sips['fechaInicio']


# In[7]:


df_sips.head()


# In[8]:


df_sips = df_sips[['CUPS', 'fechaInicio', 'fechaFin', 'dias', 'potencia1', 'potencia2', 'potencia3', 'potencia4', 'potencia5', 'potencia6']]


# In[9]:


df_sips.head()


# In[10]:


df_sips['potencia1'] = df_sips[['potencia1', 'potencia4']].max(axis=1)
df_sips['potencia2'] = df_sips[['potencia2', 'potencia5']].max(axis=1)
df_sips['potencia3'] = df_sips[['potencia3', 'potencia6']].max(axis=1)


# In[11]:


df_sips = df_sips[['CUPS', 'fechaInicio', 'fechaFin', 'dias', 'potencia1', 'potencia2', 'potencia3']]


# In[12]:


df_sips.head()


# In[13]:


df_sips['dias'] = df_sips['dias'].dt.days


# In[14]:


df_sips = df_sips.sort_values(by='fechaFin', ascending=False).reset_index(drop=True)


# In[15]:


value = 0

for index, row in df_sips.iterrows():
    value = row['dias'] + value
    if value > 365:
        fila = index
        break

print(fila)
    


# In[16]:


df_sips = df_sips.head(fila+1)


# In[17]:


df_sips.head()


# In[18]:


df_sips.dtypes


# In[19]:


df_sips['dias'].sum()


# In[20]:


potenciacon1 = 450
potenciacon2 = 450
potenciacon3 = 450


# In[21]:


# Vendria de SQL

data = [['3.0A', 40.728885, 24.437330, 16.291555], ['3.1A', 59.173468, 36.490689, 8.3677310]]
dfAtrPotencia = pd.DataFrame(data, columns=['tarifa', 'P1', 'P2', 'P3'])


# In[22]:


dfAtrPotencia.head()


# In[23]:


dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P1'][0]


# In[24]:


df_sips.head()


# In[25]:


df_sips_actual = df_sips.copy()


# In[26]:



def iterarpotencia(potencia, potencianame, value2):
    
    
    while potencia > 15:
        
        for index, row in df_sips.iterrows():
            if potencia*1.05 < row['potencia' + potencianame[-1:]]:
                iForValue = potencia + 2*(row['potencia' + potencianame[-1:]]-potencia)
                df_sips.at[index, potencianame] = iForValue
                df_sips.at[index, 'potenciaContratar' + potencianame[-1:]] = potencia
                
            elif potencia*0.85 > row['potencia' + potencianame[-1:]]:
                iForValue = potencia*0.85
                df_sips.at[index, potencianame] = iForValue
                df_sips.at[index, 'potenciaContratar' + potencianame[-1:]] = potencia
            else:
                iForValue = row['potencia' + potencianame[-1:]]
                df_sips.at[index, potencianame] = iForValue
                df_sips.at[index, 'potenciaContratar' + potencianame[-1:]] = potencia
                
        value = (df_sips[potencianame]*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A'][potencianame][0]*df_sips['dias']/365).sum()
        if value < value2:

            potencia = potencia - 1
            value2 = value

        else:
            potencia = potencia + 1
            print(potencia)
            break


# In[28]:


def iterarpotenciaActual(potencia, potencianame, value2):
            
    for index, row in df_sips_actual.iterrows():
        if potencia*1.05 < row['potencia' + potencianame[-1:]]:
            iForValue = potencia + 2*(row['potencia' + potencianame[-1:]]-potencia)
            df_sips_actual.at[index, potencianame] = iForValue
            df_sips_actual.at[index, 'potenciaContratar' + potencianame[-1:]] = potencia

        elif potencia*0.85 > row['potencia' + potencianame[-1:]]:
            iForValue = potencia*0.85
            df_sips_actual.at[index, potencianame] = iForValue
            df_sips_actual.at[index, 'potenciaContratar' + potencianame[-1:]] = potencia
        else:
            iForValue = row['potencia' + potencianame[-1:]]
            df_sips_actual.at[index, potencianame] = iForValue
            df_sips_actual.at[index, 'potenciaContratar' + potencianame[-1:]] = potencia

  
  


# In[29]:


iterarpotencia(potenciacon1, 'P1', 10000000)
iterarpotencia(potenciacon2, 'P2', 10000000)
iterarpotencia(potenciacon3, 'P3', 10000000)


# In[30]:


df_sips['potenciaContratar1']=df_sips['potenciaContratar1']+1
df_sips['potenciaContratar2']=df_sips['potenciaContratar2']+1
df_sips['potenciaContratar3']=df_sips['potenciaContratar3']+1


# In[31]:


df_sips = df_sips[['CUPS', 'fechaInicio', 'fechaFin', 'dias', 'potenciaContratar1', 'potenciaContratar2', 'potenciaContratar3']]


# In[32]:


df_sips['coste'] = (df_sips['potenciaContratar1']*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P1'][0] +
                    df_sips['potenciaContratar2']*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P2'][0] +
                    df_sips['potenciaContratar3']*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P3'][0])*df_sips['dias']/365


# In[33]:


df_sips.head()


# In[35]:


iterarpotenciaActual(potenciaActual1, 'P1', 10000000)
iterarpotenciaActual(potenciaActual2, 'P2', 10000000)
iterarpotenciaActual(potenciaActual3, 'P3', 10000000)


# In[37]:


df_sips_actual = df_sips_actual[['CUPS', 'fechaInicio', 'fechaFin', 'dias', 'P1', 'P2', 'P3']]


# In[39]:


df_sips_actual['coste'] = (df_sips_actual['P1']*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P1'][0] + 
                           df_sips_actual['P2']*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P2'][0] +
                           df_sips_actual['P3']*dfAtrPotencia[dfAtrPotencia['tarifa']=='3.0A']['P3'][0])*df_sips_actual['dias']/365


# In[40]:


df_sips_actual.head()


# In[51]:


ahorroPotencias = df_sips_actual['coste']-df_sips['coste']
print('Ahorro Total: ' + str(round(ahorroPotencias.sum(),2)) + '€ (Falta añadir impuesto eléctrico)')
print(ahorroPotencias)


# In[54]:


print(df_sips_actual)


# In[53]:


print(df_sips)


# In[ ]:




