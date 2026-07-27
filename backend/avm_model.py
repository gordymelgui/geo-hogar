import json
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer

def main():
    print("--- INICIANDO MOTOR AVM (AUTOMATED VALUATION MODEL) ---")
    
    # Path to JSON file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_dir, 'propiedades-procesadas.json')
    frontend_path = os.path.join(base_dir, '../data/propiedades.json')
    
    if not os.path.exists(input_path):
        print(f"Error: No se encontro el archivo {input_path}")
        return
        
    with open(input_path, 'r', encoding='utf-8') as f:
        properties = json.load(f)
        
    print(f"Cargadas {len(properties)} propiedades para entrenamiento AVM.")
    
    # Preprocesamiento de datos
    df = pd.DataFrame(properties)
    
    # Filtramos solo ventas para entrenar el modelo de precios
    df_sales = df[(df['op'] == 'Venta') & (df['price'] > 10000) & (df['m2'] > 10)].copy()
    print(f"Propiedades validas para entrenamiento de modelo de ventas: {len(df_sales)}")
    
    if len(df_sales) < 10:
        print("No hay suficientes propiedades para entrenar el AVM.")
        return
        
    # Variables predictoras (Features)
    features = ['m2', 'rooms', 'baths', 'lat', 'lng', 'plusvaliaScore', 'type', 'neighborhood']
    
    # Limpiamos features que falten
    for col in ['rooms', 'baths', 'plusvaliaScore']:
        if col not in df_sales.columns:
            df_sales[col] = 1 if col != 'plusvaliaScore' else 50
            
    # Label encoding para variables categoricas
    le_type = LabelEncoder()
    le_neigh = LabelEncoder()
    
    df_sales['type_encoded'] = le_type.fit_transform(df_sales['type'].fillna('Unknown'))
    df_sales['neigh_encoded'] = le_neigh.fit_transform(df_sales['neighborhood'].fillna('Unknown'))
    
    X = df_sales[['m2', 'rooms', 'baths', 'lat', 'lng', 'plusvaliaScore', 'type_encoded', 'neigh_encoded']]
    y = df_sales['price']
    
    # Imputar valores faltantes
    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X)
    
    # Entrenamiento del Random Forest
    print("Entrenando modelo Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_imputed, y)
    
    score = model.score(X_imputed, y)
    print(f"Precision del modelo (R2 Score en set de entrenamiento): {score:.2f}")
    
    # Aplicar predicciones a TODAS las propiedades (Ventas)
    for p in properties:
        if p.get('op') == 'Venta' and p.get('m2', 0) > 0:
            # Preparar fila
            t = p.get('type', 'Unknown')
            n = p.get('neighborhood', 'Unknown')
            
            # Manejar categorias no vistas
            try:
                t_enc = le_type.transform([t])[0]
            except ValueError:
                t_enc = 0 # Fallback
                
            try:
                n_enc = le_neigh.transform([n])[0]
            except ValueError:
                n_enc = 0 # Fallback
                
            row = np.array([[
                p.get('m2', 0),
                p.get('rooms', 1) or 1,
                p.get('baths', 1) or 1,
                p.get('lat', 0),
                p.get('lng', 0),
                p.get('plusvaliaScore', 50),
                t_enc,
                n_enc
            ]])
            
            row_imp = imputer.transform(row)
            predicted_price = model.predict(row_imp)[0]
            
            p['avmEstimatedPrice'] = round(predicted_price)
            p['avmPriceM2'] = round(predicted_price / p.get('m2', 1))
            
            # Recalcular si es Oportunidad basado en AVM (si esta un 10% mas barato que lo que dice la IA)
            if p.get('price', 0) < predicted_price * 0.90:
                p['isUnderpricedAVM'] = True
                p['discountAVM'] = round((1 - (p.get('price', 0) / predicted_price)) * 100)
            else:
                p['isUnderpricedAVM'] = False
                p['discountAVM'] = 0

    # Sobreescribimos el json
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(properties, f, indent=2, ensure_ascii=False)
        
    with open(frontend_path, 'w', encoding='utf-8') as f:
        json.dump(properties, f, indent=2, ensure_ascii=False)
        
    print("Predicciones AVM guardadas exitosamente.")

if __name__ == "__main__":
    main()
